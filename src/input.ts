import { InputId } from "./id";
import {
  VirtualComparator,
  ThresholdComparator,
  BasicComparator,
} from "./comparators";

export { InputId } from "./id";

/** Basic settings for any controller input */
export interface InputParams {
  /** User-friendly name for the input */
  name?: string;
  /** Icon representing the input */
  icon?: string;
  /** Ignore changes numeric inputs less than this value */
  threshold?: number;
  /** Ignore numeric inputs below this value */
  deadzone?: number;
}

/** Track inputs on button press, release, or both */
export type InputChangeType = "change" | "press" | "release";
/** Keys representing possible input events */
export type InputEventType = InputChangeType | "input";

/** Callback for recieving controller input changes */
export type InputCallback<Instance> = (
  input: Instance,
  changed: Instance | Input<unknown>
) => unknown | Promise<unknown>;

/** Symbol for modifying the comparison function used by Inputs */
export const InputSetComparator = Symbol("InputSetComparator");
/** Symbol for modifying the current value of an Input */
export const InputSet = Symbol("InputSet");
/** Symbol for accessing the name of an Input */
export const InputName = Symbol("InputName");
/** Symbole for accessing the icon of an Input */
export const InputIcon = Symbol("InputIcon");

/** Symbol for accessing an Input's event subscriber callbacks */
const InputOns = Symbol("InputOns");
/** Symbol for accessing an Input's single-time subscriber callbacks */
const InputOnces = Symbol("InputOnces");
/** Symbol for notifying an Input that it has a parent */
const InputAdopt = Symbol("InputAdopt");
/** Symbol for accessing an Input's parent Inputs */
const InputParents = Symbol("InputParents");
/** Symbol for accessing the comparison function used by an Input */
const InputComparator = Symbol("InputComparator");

/**
 * Input manages the state of a single device input,
 * a virtual input, or a group of Input children.
 */
export abstract class Input<Type> implements AsyncIterator<Input<Type>> {
  public readonly id: InputId = InputId.Unknown;

  /** For numeric inputs, ignore state changes smaller than this threshold */
  public threshold: number = 0;

  /** For numeric inputs, ignore states smaller than this deadzone */
  public deadzone: number = 0;

  /** The current value of this input */
  public abstract state: Type;

  /** Stores event listeners */
  private [InputOns] = new Map<InputEventType, InputCallback<this>[]>();

  /** Stores callbacks waiting for one-time events */
  private [InputOnces] = new Map<InputChangeType, InputCallback<this>[]>();

  constructor(params: InputParams = {}) {
    const { name, icon, threshold, deadzone } = params;

    if (name) this[InputName] = name;
    if (icon) this[InputIcon] = icon;
    if (threshold) this.threshold = threshold;
    if (deadzone) this.deadzone = deadzone;

    setTimeout(() => {
      this[InputSetComparator]();
      Object.values(this).forEach((value) => {
        if (value === this) return;
        if (value instanceof Input) value[InputAdopt](this as Input<unknown>);
      });
    });
  }

  /** Returns true if this input or any nested inputs are currently in use */
  public abstract get active(): boolean;

  /** Register a callback to recieve state updates from this Input */
  public on(event: InputEventType, listener: InputCallback<this>): this {
    const listeners = this[InputOns].get(event);
    if (!listeners) {
      this[InputOns].set(event, []);
      return this.on(event, listener);
    }
    listeners.push(listener);
    return this;
  }

  /** Register a callback to recieve the next specified update */
  public once(event: InputChangeType, listener: InputCallback<this>): this {
    const listeners = this[InputOnces].get(event);
    if (!listeners) {
      this[InputOnces].set(event, []);
      return this.once(event, listener);
    }
    listeners.push(listener);
    return this;
  }

  /** Notify listeners and parents of a state change */
  private emit(event: InputEventType, changed: Input<unknown> | this): void {
    const listeners = this[InputOns].get(event) ?? [];
    listeners.forEach((callback) => {
      callback(this, changed);
    });

    if (event !== "input") {
      this.emitOnce(event, changed);
      this[InputParents].forEach((input) => {
        input.emit(event, changed as Input<unknown>);
      });
    }
  }

  /** Notify one-time listeners of a state change */
  private emitOnce(
    event: InputChangeType,
    changed: this | Input<unknown> = this
  ): void {
    const listeners = this[InputOnces].get(event) ?? [];
    this[InputOnces].set(event, []);
    listeners.forEach((callback) => {
      callback(this, changed as Input<unknown>);
    });
  }

  /** Register a callback to recieve state updates from this Input */
  public addEventListener(
    event: InputEventType,
    listener: InputCallback<this>,
    { once }: { once: boolean } = { once: false }
  ): this {
    if (once) {
      if (event === "input") {
        throw new Error("Can't listen once to `input` events");
      }
      return this.once(event, listener);
    }
    return this.on(event, listener);
  }

  /** Resolves on the next change to this input's state */
  public next(type: InputChangeType = "change"): Promise<IteratorResult<this>> {
    return new Promise<IteratorResult<this>>((resolve) => {
      this.once(type, () => {
        resolve({ value: this, done: false });
      });
    });
  }

  /** Resolves on the next change to this input's state */
  public promise(
    type: "press" | "release" | "change" = "change"
  ): Promise<this> {
    return new Promise<this>((resolve) => {
      this.once(type, () => resolve(this));
    });
  }

  /** Render a debugging string */
  public toString(): string {
    return `${this[InputIcon]} [${this.active ? "X" : "_"}]`;
  }

  /** Returns true if the provided state is worth an event */
  [InputComparator]: (state: Type, newState: Type) => boolean = BasicComparator;

  [Symbol.asyncIterator](): AsyncIterator<this> {
    return this;
  }

  [Symbol.toPrimitive](hint: "number" | "string" | "default"): number | string {
    if (hint === "string") return String(this.state);
    if (typeof this.state === "number") return this.state;
    return Number(this.state);
  }

  get [Symbol.toStringTag](): string {
    return this.toString();
  }

  /** The name of this input */
  readonly [InputName]: string = "Unknown Input";

  /** A short name for this input */
  readonly [InputIcon]: string = "???";

  /** Other Inputs that contain this one */
  private [InputParents] = new Set<Input<unknown>>();

  /** Links Inputs to bubble up events */
  [InputAdopt](parent: Input<unknown>): void {
    this[InputParents].add(parent);
  }

  /** Sets a default comparison type for the Input */
  [InputSetComparator](): void {
    if (typeof this.state === "number") {
      this[InputComparator] = ThresholdComparator.bind(
        this,
        this.threshold,
        this.deadzone
      );
    } else if (this.state instanceof Input) {
      this[InputComparator] = VirtualComparator;
    } else {
      this[InputComparator] = BasicComparator;
    }
  }

  /** Update the input's state and trigger all necessary callbacks */
  [InputSet](state: Type): void {
    if (this[InputComparator](this.state, state)) {
      this.state = state;
      this.emit("change", this);
      if (typeof state === "boolean")
        this.emit(state ? "press" : "release", this);
    }
    this.emit("input", this);
  }
}
