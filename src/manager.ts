import { Dualsense } from "./dualsense";
import { Input, InputSet, InputParams } from "./input";
import { PlayerID } from "./hid/command";
import { DualsenseHID } from "./hid/dualsense_hid";
import { HIDProvider, DualsenseDeviceInfo } from "./hid/hid_provider";
import { NodeHIDProvider } from "./hid/node_hid_provider";
import { WebHIDProvider } from "./hid/web_hid_provider";

/** Slot tracking a controller and its identity */
interface ControllerSlot {
  /** The Dualsense instance for this slot */
  controller: Dualsense;
  /**
   * Stable hardware identity, derived from firmware info once available.
   * Format: "serial:..." (factory serial) or "device:..." (firmware deviceInfo blob).
   * Preferred over node-hid's serial number, which can be unreliable.
   */
  identity?: string;
  /** Best-effort serial number from node-hid (may be wrong/missing) */
  serial?: string;
  /** Current device path (Node.js) */
  path?: string;
  /** Slot index (stable, never reused until released) */
  index: number;
  /** Set after we've subscribed to onReady, to avoid double-wiring */
  readyHooked?: boolean;
  /**
   * True until firmware/factory info has loaded for the first time.
   * Provisional slots are hidden from public state (`controllers`,
   * `count`, `state.players`) so consumers don't see a connect that
   * might immediately get merged into an existing slot via identity
   * matching. Made non-provisional in `handleSlotReady`.
   */
  provisional?: boolean;
}

/** The state exposed by a DualsenseManager via the Input system */
export interface DualsenseManagerState {
  /** Number of currently connected controllers */
  active: number;
  /** All managed controllers, keyed by slot index (player number) */
  players: ReadonlyMap<number, Dualsense>;
}

/**
 * Default player LED patterns.
 * Indices 0–3 match the PS5 console convention (PlayerID enum).
 * Indices 4–30 fill the remaining 5-bit patterns for players 5–31.
 */
const DEFAULT_PLAYER_PATTERNS: number[] = [
  // Players 1–4: PS5 standard
  PlayerID.Player1, // 0x04 = 00100
  PlayerID.Player2, // 0x0a = 01010
  PlayerID.Player3, // 0x15 = 10101
  PlayerID.Player4, // 0x1b = 11011

  // Players 5–31: remaining patterns, ordered for visual distinctiveness
  0x01, // 00001
  0x02, // 00010
  0x08, // 01000
  0x10, // 10000
  0x11, // 10001
  0x03, // 00011
  0x18, // 11000
  0x05, // 00101
  0x14, // 10100
  0x09, // 01001
  0x12, // 10010
  0x06, // 00110
  0x0c, // 01100
  0x07, // 00111
  0x1c, // 11100
  0x0e, // 01110
  0x19, // 11001
  0x13, // 10011
  0x0b, // 01011
  0x1a, // 11010
  0x0d, // 01101
  0x16, // 10110
  0x17, // 10111
  0x1d, // 11101
  0x0f, // 01111
  0x1e, // 11110
  PlayerID.All, // 0x1f = 11111
];

/** Settings for the DualsenseManager */
export interface DualsenseManagerParams extends InputParams {
  /** Polling interval (ms) for discovering new devices in Node.js. Default: 2000 */
  discoveryInterval?: number;
  /** Whether to automatically assign player LED patterns. Default: true */
  autoAssignPlayerLeds?: boolean;
}

/**
 * Manages multiple Dualsense controllers. Automatically discovers devices,
 * assigns player LEDs, and provides indexed access to each controller.
 *
 * Extends Input so that events from all managed controllers bubble up:
 * - `change` fires when the controller count changes or any controller input changes
 * - `press` / `release` bubble from any managed controller (including connection state)
 */
export class DualsenseManager extends Input<DualsenseManagerState> {
  /** Current manager state: active count and player map */
  public state: DualsenseManagerState = {
    active: 0,
    players: new Map(),
  };

  /** Whether to auto-assign player LED patterns on connection */
  public autoAssignPlayerLeds: boolean;

  /** Player LED bitmask patterns indexed by slot number (0–30) */
  private readonly playerPatterns: number[] = [...DEFAULT_PLAYER_PATTERNS];

  /** All controller slots, indexed by slot number */
  private readonly slots: ControllerSlot[] = [];

  /** Map from node-hid serial to slot index — best-effort, used as a fallback */
  private readonly serialToSlot = new Map<string, number>();

  /** Map from canonical hardware identity to slot index — preferred when available */
  private readonly identityToSlot = new Map<string, number>();

  /** Discovery polling timer (Node.js only) */
  private discoveryTimer?: ReturnType<typeof setInterval>;

  /** Whether we're running in a browser environment */
  private readonly isBrowser: boolean = typeof window !== "undefined";

  constructor(params: DualsenseManagerParams = {}) {
    super({
      name: "DualsenseManager",
      icon: "🎮",
      ...params,
    });

    this.autoAssignPlayerLeds = params.autoAssignPlayerLeds ?? true;

    if (this.isBrowser) {
      this.startWebDiscovery();
    } else {
      this.startNodeDiscovery(params.discoveryInterval ?? 2000);
    }
  }

  public get active(): boolean {
    return this.state.active > 0;
  }

  /**
   * All managed controller instances (including disconnected ones awaiting
   * reconnection). Excludes provisional slots whose identity is still being
   * resolved — those become visible only after firmware info loads, to
   * avoid surfacing controllers that may be merged into an existing slot.
   */
  public get controllers(): readonly Dualsense[] {
    return this.publicSlots().map((s) => s.controller);
  }

  /** Number of managed controllers (including disconnected ones awaiting reconnection) */
  public get count(): number {
    return this.publicSlots().length;
  }

  /** Get a controller by slot index */
  public get(index: number): Dualsense | undefined {
    const slot = this.slots[index] as ControllerSlot | undefined;
    if (!slot || slot.provisional) return undefined;
    return slot.controller;
  }

  /** Iterate over all managed controllers */
  [Symbol.iterator](): IterableIterator<Dualsense> {
    return this.publicSlots().map((s) => s.controller).values();
  }

  /** Slots that are visible to the consumer (i.e. identity has been resolved) */
  private publicSlots(): ControllerSlot[] {
    return this.slots.filter((s) => !s.provisional);
  }

  /**
   * True while at least one controller has been discovered but is still
   * waiting for firmware info to load. Useful for showing a "connecting"
   * state in the UI without surfacing the unresolved slot itself.
   */
  public get pending(): boolean {
    return this.slots.some((s) => s.provisional);
  }

  /**
   * Override the player LED pattern for a given slot index.
   * @param index Slot index (0-based)
   * @param bitmask 5-bit LED bitmask (0x00–0x1f)
   */
  public setPlayerPattern(index: number, bitmask: number): void {
    this.playerPatterns[index] = bitmask & 0x1f;

    // Apply immediately if a controller occupies this slot (index may be out of bounds)
    const slot = this.slots[index] as ControllerSlot | undefined;
    if (slot && this.autoAssignPlayerLeds) {
      slot.controller.playerLeds.set(this.playerPatterns[index]);
    }
  }

  /** Get the player LED pattern for a given slot index */
  public getPlayerPattern(index: number): number {
    return this.playerPatterns[index] ?? 0;
  }

  /**
   * Release a controller slot, freeing it for reuse.
   * If the controller is still connected, it will be disconnected.
   * @param index Slot index to release
   */
  public release(index: number): void {
    const slot = this.slots[index] as ControllerSlot | undefined;
    if (!slot) return;

    // Disconnect the HID provider and release the claimed device
    slot.controller.hid.provider.disconnect();

    // Remove identity / serial mappings
    if (slot.identity) {
      this.identityToSlot.delete(slot.identity);
    }
    if (slot.serial) {
      this.serialToSlot.delete(slot.serial);
    }

    // Remove the slot (shift remaining slots down)
    this.slots.splice(index, 1);

    // Re-index identity / serial mappings after splice
    for (let i = index; i < this.slots.length; i++) {
      const s = this.slots[i];
      s.index = i;
      if (s.identity) {
        this.identityToSlot.set(s.identity, i);
      }
      if (s.serial) {
        this.serialToSlot.set(s.serial, i);
      }
      // Update player LEDs for shifted slots
      if (this.autoAssignPlayerLeds) {
        s.controller.playerLeds.set(this.playerPatterns[i] ?? 0);
      }
    }

    this.updateState();
  }

  /**
   * Release all disconnected controller slots.
   * Connected controllers are not affected.
   */
  public releaseDisconnected(): void {
    // Iterate in reverse to avoid index shifting issues
    for (let i = this.slots.length - 1; i >= 0; i--) {
      if (!this.slots[i].controller.connection.active) {
        this.release(i);
      }
    }
  }

  /**
   * Stop discovery and disconnect all controllers.
   */
  public dispose(): void {
    if (this.discoveryTimer) {
      clearInterval(this.discoveryTimer);
      this.discoveryTimer = undefined;
    }

    // Disconnect all controllers in reverse order
    for (let i = this.slots.length - 1; i >= 0; i--) {
      this.release(i);
    }
  }

  /**
   * For WebHID: returns a click handler that opens the device picker,
   * allowing the user to select multiple controllers at once.
   */
  public getRequest(): () => Promise<void> {
    if (!this.isBrowser) {
      return () => Promise.resolve();
    }

    return WebHIDProvider.getMultiRequest(
      (device: HIDDevice) => { this.addWebDevice(device); }
    );
  }

  // --- Private ---

  /** Previous state snapshot, for deduplication */
  private lastActive = 0;
  private lastPlayerCount = 0;
  /** Fingerprint of the last published player set (slot indices + connected flags) */
  private lastPlayerKey = "";

  /** Build a new state snapshot and push it through InputSet */
  private updateState(): void {
    const players = new Map<number, Dualsense>();
    let activeCount = 0;
    let key = "";
    for (const slot of this.slots) {
      if (slot.provisional) continue;
      players.set(slot.index, slot.controller);
      const connected = slot.controller.connection.active;
      if (connected) activeCount += 1;
      key += `${slot.index}:${connected ? "1" : "0"},`;
    }

    // Suppress no-op publishes (e.g. provisional slots churning without
    // changing the visible state) to avoid noisy change events.
    if (
      activeCount === this.lastActive &&
      players.size === this.lastPlayerCount &&
      key === this.lastPlayerKey
    ) {
      return;
    }
    this.lastActive = activeCount;
    this.lastPlayerCount = players.size;
    this.lastPlayerKey = key;

    this[InputSet]({ active: activeCount, players });
  }

  /**
   * Create a Dualsense instance and register it in a (provisional) slot.
   * The caller is responsible for opening the device on the provider — the
   * manager treats this as the *only* path that opens new devices, so
   * identity matching can run before the slot becomes visible.
   *
   * Note: identity is the sole reconnection key. We do NOT key on node-hid's
   * serialNumber because it can be missing or wrong. Path is tracked only
   * so we can re-target the same device on transplant.
   */
  private createSlot(
    provider: HIDProvider,
    serial?: string,
    path?: string
  ): ControllerSlot {
    const hid = new DualsenseHID(provider);
    const controller = new Dualsense({ hid });
    const index = this.slots.length;

    const slot: ControllerSlot = {
      controller,
      serial,
      path,
      index,
      // Hide from public state until firmware info has been read and any
      // identity-based merge has had a chance to run.
      provisional: true,
    };
    this.slots.push(slot);

    if (serial) {
      this.serialToSlot.set(serial, index);
    }

    // Assign player LEDs — skip for provisional slots (they may get
    // transplanted to a different index). Re-apply on every connect.
    const applyPlayerLeds = () => {
      if (this.autoAssignPlayerLeds && !slot.provisional) {
        controller.playerLeds.set(this.playerPatterns[slot.index] ?? 0);
      }
    };
    applyPlayerLeds();

    // Track connection changes
    controller.connection.on("change", () => {
      if (controller.connection.active) {
        applyPlayerLeds();
      }
      this.updateState();
    });

    // Hook firmware-info readiness so we can perform identity-based slot
    // matching once the controller's hardware identity is known. This is
    // far more reliable than node-hid's serial number, which can be
    // missing or wrong.
    if (!slot.readyHooked) {
      slot.readyHooked = true;
      hid.onReady(() => this.handleSlotReady(slot));
    }

    this.updateState();

    return slot;
  }

  /**
   * Called when a slot's HID layer has finished reading firmware/factory info.
   * If the resolved identity matches a *different* (disconnected) slot, the
   * underlying device is transplanted into that slot's existing provider so
   * the consumer's Dualsense reference is preserved across reconnect.
   */
  private handleSlotReady(slot: ControllerSlot): void {
    const identity = slot.controller.hid.identity;

    // No identity at all (firmware read failed completely after retries) —
    // promote the slot anyway so the consumer can still use it. We just
    // won't be able to merge it on reconnect.
    if (!identity) {
      this.promoteSlot(slot);
      return;
    }

    const existingIndex = this.identityToSlot.get(identity);

    // First time we've seen this identity — claim it for this slot.
    if (existingIndex === undefined) {
      slot.identity = identity;
      this.identityToSlot.set(identity, slot.index);
      this.promoteSlot(slot);
      return;
    }

    // We already have a slot for this identity — make sure it's not just us.
    if (existingIndex === slot.index) {
      this.promoteSlot(slot);
      return;
    }

    const existingSlot = this.slots[existingIndex] as
      | ControllerSlot
      | undefined;
    if (!existingSlot) {
      // Stale mapping — overwrite.
      slot.identity = identity;
      this.identityToSlot.set(identity, slot.index);
      this.promoteSlot(slot);
      return;
    }

    // If the existing slot is currently connected, both slots map to the
    // same hardware (shouldn't normally happen). Prefer the older slot
    // and drop the new one without ever publishing it.
    if (existingSlot.controller.connection.active) {
      this.dropSlot(slot);
      return;
    }

    // Existing slot is disconnected — transplant the new device into it.
    // The new (provisional) slot is dropped before any state is published,
    // so the consumer only ever sees the original slot reconnect in place.
    this.transplant(slot, existingSlot);
  }

  /** Mark a slot as visible to consumers and publish state */
  private promoteSlot(slot: ControllerSlot): void {
    if (!slot.provisional) return;
    slot.provisional = false;
    if (this.autoAssignPlayerLeds) {
      slot.controller.playerLeds.set(this.playerPatterns[slot.index] ?? 0);
    }
    this.updateState();
  }

  /**
   * Move the device handle from `from` into `into`'s existing provider so
   * the existing Dualsense instance reconnects in place. Then remove `from`.
   */
  private transplant(from: ControllerSlot, into: ControllerSlot): void {
    const fromProvider = from.controller.hid.provider;
    const intoProvider = into.controller.hid.provider;

    if (
      fromProvider instanceof WebHIDProvider &&
      intoProvider instanceof WebHIDProvider &&
      fromProvider.device
    ) {
      // Move the open HIDDevice handle from the source provider to the
      // destination. We can't close + reopen here — that would race with
      // the destination's attach() call. Instead we abandon the source
      // provider in place (its slot is about to be dropped) and let the
      // destination take over the same handle. The source's input listener
      // will be GC'd along with the source provider once nothing else
      // references the dropped slot's Dualsense.
      const device = fromProvider.device;
      fromProvider.device = undefined;
      if (fromProvider.deviceId) {
        HIDProvider.claimedDevices.delete(fromProvider.deviceId);
        fromProvider.deviceId = undefined;
      }
      intoProvider.replaceDevice(device);
    } else if (
      fromProvider instanceof NodeHIDProvider &&
      intoProvider instanceof NodeHIDProvider
    ) {
      // node-hid HID handles can't be moved between providers, so we close
      // the source (releasing its path claim) and re-open the same path on
      // the destination provider — preserving the existing Dualsense
      // instance and its subscribers.
      const newPath = from.path;
      const newSerial = from.serial;
      fromProvider.disconnect();
      intoProvider.targetPath = newPath;
      intoProvider.targetSerial = newSerial;
      into.path = newPath;
      into.serial = newSerial;
      void Promise.resolve(intoProvider.connect()).catch(() => {
        /* errors surface via provider.onError */
      });
    }

    this.dropSlot(from);
  }

  /** Remove a slot without firing the player-LED reshuffle */
  private dropSlot(slot: ControllerSlot): void {
    const idx = this.slots.indexOf(slot);
    if (idx === -1) return;

    if (slot.identity) this.identityToSlot.delete(slot.identity);
    if (slot.serial) this.serialToSlot.delete(slot.serial);

    this.slots.splice(idx, 1);

    // Re-index the trailing slots
    for (let i = idx; i < this.slots.length; i++) {
      const s = this.slots[i];
      s.index = i;
      if (s.identity) this.identityToSlot.set(s.identity, i);
      if (s.serial) this.serialToSlot.set(s.serial, i);
    }

    this.updateState();
  }

  // --- Node.js discovery ---

  private startNodeDiscovery(intervalMs: number): void {
    const poll = async () => {
      try {
        const devices: DualsenseDeviceInfo[] =
          await NodeHIDProvider.enumerate();
        for (const device of devices) {
          this.processDiscoveredDevice(device);
        }
      } catch {
        // Enumeration failed, will retry next interval
      }
    };

    // Initial scan
    void poll();
    this.discoveryTimer = setInterval(() => void poll(), intervalMs);
  }

  /**
   * Handle a newly discovered device from enumeration. Opens the device on
   * a fresh provider, which adds it to `claimedDevices` so subsequent polls
   * skip it. Identity matching (and any merge into a disconnected slot)
   * happens later, once firmware info has been read.
   */
  private processDiscoveredDevice(device: DualsenseDeviceInfo): void {
    if (HIDProvider.claimedDevices.has(device.path)) return;

    const provider = new NodeHIDProvider({
      devicePath: device.path,
      serialNumber: device.serialNumber,
    });
    this.createSlot(provider, device.serialNumber, device.path);
    // Drive the connection. The Dualsense instance no longer polls in
    // managed mode, so the manager owns this. claimedDevices is added
    // synchronously inside connect() on success, preventing duplicate
    // discovery on the next poll tick.
    void Promise.resolve(provider.connect()).catch(() => {
      /* errors surface via provider.onError */
    });
  }

  // --- WebHID discovery ---

  private startWebDiscovery(): void {
    if (typeof navigator !== "undefined" && navigator.hid) {
      navigator.hid.addEventListener("connect", ({ device }) => {
        this.addWebDevice(device);
      });

      // Poll for permitted devices. The WebHID connect event only fires
      // for newly-permitted devices, not for already-permitted devices
      // that physically reconnect. Periodic enumeration catches those.
      const poll = () => {
        void WebHIDProvider.enumerate().then((devices) => {
          for (const device of devices) {
            this.addWebDevice(device);
          }
        });
      };
      poll();
      this.discoveryTimer = setInterval(poll, 2000);
    }
  }

  /** HIDDevice objects we've already handed to a provider */
  private readonly knownWebDevices = new WeakSet<HIDDevice>();

  private addWebDevice(device: HIDDevice): void {
    // WeakSet tracks object identity — enumerate() returns the same objects
    // for still-connected devices, so this deduplicates across polls.
    // On reconnect, the browser provides a fresh HIDDevice object, so it
    // passes this check and creates a new provisional slot.
    if (this.knownWebDevices.has(device)) return;
    this.knownWebDevices.add(device);

    const provider = new WebHIDProvider({ device });
    this.createSlot(provider, undefined, undefined);
  }
}
