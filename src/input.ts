import { InputId } from "./id";
import {
  VirtualComparator,
  ThresholdComparator,
  BasicComparator,
} from "./comparators";

export { InputId } from "./id";

export interface InputParams {
  name?: string;
  icon?: string;
  threshold?: number;
}

export type InputChangeType = "change" | "press" | "release";
export type InputEventType = InputChangeType | "input";

export type InputCallback<Type> = (
  input: Input<Type>,
  changed: Input<unknown>
) => unknown | Promise<unknown>;

/**
 * Private utilities
 */

export const InputSetComparator = Symbol("InputSetComparator");
export const InputChanged = Symbol("InputChanged");
export const InputSet = Symbol("InputSet");
export const InputName = Symbol("InputName");
export const InputIcon = Symbol("InputIcon");

/**
 * Private properties
 */

const InputOns = Symbol("InputOns");
const InputOnces = Symbol("InputOnces");
const InputAdopt = Symbol("InputAdopt");
const InputParents = Symbol("InputParents");
const InputComparator = Symbol("InputComparator");

/**
 * Input manages the state of a single device input,
 * a virtual input, or a group of Input children.
 */
export abstract class Input<Type> implements AsyncIterator<Input<Type>> {
  public readonly id: InputId = InputId.Unknown;

  /**
   * For numeric inputs, ignore state changes smaller than this threshold.
   */
  public threshold: number = 0;

  /**
   * Provide the type and default value for the input.
   */
  public abstract state: Type;

  /**
   * Stores event listeners.
   */
  private [InputOns] = new Map<InputEventType, InputCallback<Type>[]>();

  /**
   * Stores callbacks waiting for one-time events.
   */
  private [InputOnces] = new Map<InputChangeType, InputCallback<Type>[]>();

  constructor(params: InputParams = {}) {
    const { name, icon, threshold } = {
      icon: "???",
      name: "Nameless Input",
      threshold: 0,
      ...params,
    };

    this[InputName] = name;
    this[InputIcon] = icon;
    this.threshold = threshold;

    setImmediate(() => {
      this[InputSetComparator]();
      Object.values(this).forEach((value) => {
        if (value === this) return;
        if (value instanceof Input) value[InputAdopt](this as Input<unknown>);
      });
    });
  }

  /**
   * Implement a function that returns true if the user is actively engaged with the input.
   */
  public abstract get active(): boolean;

  /**
   * Register a callback to recieve state updates from this Input.
   */
  public on(event: InputEventType, listener: InputCallback<Type>): this {
    const listeners = this[InputOns].get(event);
    if (!listeners) {
      this[InputOns].set(event, []);
      return this.on(event, listener);
    }
    listeners.push(listener);
    return this;
  }

  /**
   * Register a callback to recieve the next state update of the provided type..
   */
  public once(event: InputChangeType, listener: InputCallback<Type>): this {
    const listeners = this[InputOnces].get(event);
    if (!listeners) {
      this[InputOnces].set(event, []);
      return this.once(event, listener);
    }
    listeners.push(listener);
    return this;
  }

  /**
   * Notify listeners and parents of a state change.
   */
  private emit(event: InputEventType, changed: Input<unknown> | this): void {
    const listeners = this[InputOns].get(event) || [];
    listeners.forEach((callback) => {
      callback(this, changed as Input<unknown>);
    });

    if (event !== "input") {
      this.emitOnce(event, changed as Input<unknown>);
      this[InputParents].forEach((input) => {
        input.emit(event, changed as Input<unknown>);
      });
    }
  }

  /**
   * Notify one-time listeners of a state change.
   */
  private emitOnce(
    event: InputChangeType,
    changed: this | Input<unknown> = this
  ): void {
    const listeners = this[InputOnces].get(event) || [];
    this[InputOnces].set(event, []);
    listeners.forEach((callback) => {
      callback(this, changed as Input<unknown>);
    });
  }

  /**
   * Register a callback to recieve state updates from this Input.
   */
  public addEventListener(
    event: InputEventType,
    listener: InputCallback<Type>,
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

  /**
   * Resolves on the next change to this input's state.
   */
  public next(type: InputChangeType = "change"): Promise<IteratorResult<this>> {
    return new Promise<IteratorResult<this>>((resolve) => {
      this.once(type, () => {
        resolve({ value: this, done: false });
      });
    });
  }

  /**
   * Resolves on the next change to this input's state.
   */
  public promise(
    type: "press" | "release" | "change" = "change"
  ): Promise<this> {
    return new Promise<this>((resolve) => {
      this.once(type, () => resolve(this));
    });
  }

  /**
   * Render a debugging string.
   */
  public toString(): string {
    return `${this[InputIcon]} [${this.active ? "X" : "_"}]`;
  }

  /**
   * Returns true if the provided state is worth an event
   */
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

  /**
   * The name of this input.
   */
  readonly [InputName]: string;

  /**
   * A short name for this input.
   */
  readonly [InputIcon]: string;

  /**
   * Other Inputs that contain this one.
   */
  private [InputParents] = new Set<Input<unknown>>();

  /**
   * Links Inputs to bubble up events.
   */
  [InputAdopt](parent: Input<unknown>): void {
    this[InputParents].add(parent);
  }

  /**
   * Sets a default comparison type for the Input by discovering the generic type.
   */
  [InputSetComparator](): void {
    if (typeof this.state === "number") {
      this[InputComparator] = ThresholdComparator.bind(this, this.threshold);
    } else if (this.state instanceof Input) {
      this[InputComparator] = VirtualComparator;
    } else {
      this[InputComparator] = BasicComparator;
    }
  }

  /**
   * Update the input's state and trigger all necessary callbacks.
   */
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
