import { Dualsense } from "./dualsense";
import { Input, InputSet, InputAdopt, InputParams } from "./input";
import { PlayerID } from "./hid/command";
import { DualsenseHID } from "./hid/dualsense_hid";
import { HIDProvider, DualsenseDeviceInfo } from "./hid/hid_provider";
import { NodeHIDProvider } from "./hid/node_hid_provider";
import { WebHIDProvider } from "./hid/web_hid_provider";

/** Slot tracking a controller and its identity */
interface ControllerSlot {
  /** The Dualsense instance for this slot */
  controller: Dualsense;
  /** Serial number for reconnection matching (Node.js only) */
  serial?: string;
  /** Current device path */
  path?: string;
  /** Slot index (stable, never reused until released) */
  index: number;
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

  /** Map from serial number to slot index, for reconnection matching */
  private readonly serialToSlot = new Map<string, number>();

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

  /** All managed controller instances (including disconnected ones awaiting reconnection) */
  public get controllers(): readonly Dualsense[] {
    return this.slots.map((s) => s.controller);
  }

  /** Number of managed controllers (including disconnected ones awaiting reconnection) */
  public get count(): number {
    return this.slots.length;
  }

  /** Get a controller by slot index */
  public get(index: number): Dualsense | undefined {
    return this.slots[index]?.controller;
  }

  /** Iterate over all managed controllers */
  [Symbol.iterator](): IterableIterator<Dualsense> {
    return this.slots.map((s) => s.controller).values();
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

    // Remove serial mapping
    if (slot.serial) {
      this.serialToSlot.delete(slot.serial);
    }

    // Remove the slot (shift remaining slots down)
    this.slots.splice(index, 1);

    // Re-index serial mappings after splice
    for (let i = index; i < this.slots.length; i++) {
      const s = this.slots[i];
      s.index = i;
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

  /** Build a new state snapshot and push it through InputSet */
  private updateState(): void {
    const players = new Map<number, Dualsense>();
    for (const slot of this.slots) {
      players.set(slot.index, slot.controller);
    }

    const activeCount = this.slots.filter(
      (s) => s.controller.connection.active
    ).length;

    // Always creates a new object so BasicComparator detects the change
    this[InputSet]({ active: activeCount, players });
  }

  /** Create a Dualsense instance and register it in a slot */
  private createSlot(
    provider: HIDProvider,
    serial?: string,
    path?: string
  ): ControllerSlot {
    // Check if this serial already has a slot (reconnection)
    if (serial) {
      const existingIndex = this.serialToSlot.get(serial);
      if (existingIndex !== undefined) {
        const existingSlot =
          this.slots[existingIndex] as ControllerSlot | undefined;
        if (existingSlot && !existingSlot.controller.connection.active) {
          // Reconnect to existing slot: update the provider target
          if (provider instanceof NodeHIDProvider) {
            const existingProvider = existingSlot.controller.hid
              .provider as NodeHIDProvider;
            existingProvider.targetPath = path;
            existingProvider.targetSerial = serial;
          }
          existingSlot.path = path;
          // Release the new provider since we're reusing the existing one
          provider.disconnect();
          return existingSlot;
        }
      }
    }

    const hid = new DualsenseHID(provider);
    const controller = new Dualsense({ hid });
    const index = this.slots.length;

    const slot: ControllerSlot = { controller, serial, path, index };
    this.slots.push(slot);

    if (serial) {
      this.serialToSlot.set(serial, index);
    }

    // Adopt the controller so its events bubble up to the manager
    controller[InputAdopt](this as unknown as Input<unknown>);

    // Assign player LEDs
    if (this.autoAssignPlayerLeds) {
      controller.playerLeds.set(this.playerPatterns[index] ?? 0);
    }

    // Track connection changes
    controller.connection.on("change", () => {
      this.updateState();
    });

    this.updateState();

    return slot;
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

  /** Handle a newly discovered device from enumeration */
  private processDiscoveredDevice(device: DualsenseDeviceInfo): void {
    if (HIDProvider.claimedDevices.has(device.path)) return;

    // Check if this serial matches a disconnected slot
    if (device.serialNumber !== undefined) {
      const existingSlotIndex = this.serialToSlot.get(device.serialNumber);
      if (existingSlotIndex !== undefined) {
        const slot = this.slots[existingSlotIndex];
        if (!slot.controller.connection.active) {
          // Update the existing provider to reconnect via this path
          const provider = slot.controller.hid.provider as NodeHIDProvider;
          provider.targetPath = device.path;
          provider.targetSerial = device.serialNumber;
          slot.path = device.path;
          // The Dualsense's internal 200ms loop will call provider.connect()
          return;
        }
      }
    }

    // New device: create a provider and slot
    const provider = new NodeHIDProvider({
      devicePath: device.path,
      serialNumber: device.serialNumber,
    });
    this.createSlot(provider, device.serialNumber, device.path);
  }

  // --- WebHID discovery ---

  private startWebDiscovery(): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (typeof navigator !== "undefined" && navigator.hid) {
      navigator.hid.addEventListener("connect", ({ device }) => {
        this.addWebDevice(device);
      });

      // Enumerate already-permitted devices
      void WebHIDProvider.enumerate().then((devices) => {
        for (const device of devices) {
          this.addWebDevice(device);
        }
      });
    }
  }

  private addWebDevice(device: HIDDevice): void {
    // Check if any existing slot's provider already has this device
    for (const slot of this.slots) {
      const provider = slot.controller.hid.provider as WebHIDProvider;
      if (provider.device === device) return; // Already managed
    }

    const provider = new WebHIDProvider({ device });
    this.createSlot(provider, undefined, undefined);
  }
}
