import { EventEmitter } from "events";
import { inspect } from "util";

export interface InputParams {
  name?: string;
  icon?: string;
}

const InputDefaults: Required<InputParams> = {
  name: "???",
  icon: "???",
};

// Private properties
const InputAdopt = Symbol("InputAdopt");
const InputChangedDefault = Symbol("InputChangedDefault");
const InputChildless = Symbol("InputChildless");

// Optional abstract properties
export const InputValid = Symbol("InputValid");
export const InputChanged = Symbol("InputChanged");

// Utilities
export const InputSet = Symbol("InputSet");
export const InputName = Symbol("InputName");
export const InputIcon = Symbol("InputIcon");

export type InputEvent = "change" | "input";

export declare interface Input<Type> {
  on(
    event: InputEvent,
    listener: (input: Input<Type>, changed: Input<unknown>) => void
  ): this;
  emit(
    event: InputEvent,
    ...args: [Input<Type>, Input<unknown> | Input<Type>]
  ): boolean;
}

/**
 * Input manages the state of a single device input,
 * a virtual input, or a group of Input children.
 */
export abstract class Input<Type>
  extends EventEmitter
  implements AsyncIterator<Input<Type>>
{
  public readonly id: symbol;

  // Timestamp of the last received input that changed the state.
  public lastChange: number = Date.now();

  // Timestamp of the last received input, even if it didn't change the state.
  public lastInput: number = Date.now();

  // Provide the type and default value for the input.
  public abstract state: Type;

  // Implement a function that returns true if the user is actively engaged with the input.
  public abstract get active(): boolean;

  /**
   * Resolves on the next change to this input's state.
   */
  public next(): Promise<IteratorResult<this>> {
    return new Promise<IteratorResult<this>>((resolve) => {
      this.once("change", () => {
        resolve({ value: this, done: false });
      });
    });
  }

  /**
   * Resolves on the next change to this input's state.
   */
  public promise(): Promise<this> {
    return new Promise<this>((resolve) => {
      this.once("change", () => resolve(this));
    });
  }

  /**
   * Render a convenient debugging string.
   */
  public toString(): string {
    return `${this[InputIcon]} [${this.active ? "X" : "_"}]`;
  }

  constructor(params?: InputParams) {
    super();

    const { icon, name } = { ...InputDefaults, ...(params || {}) };
    this[InputName] = name;
    this[InputIcon] = icon;

    this.id = Symbol(this[InputName]);
    setImmediate(() => {
      this[InputAdopt]();
    });
  }

  // Optionally, implement a function that validates or transforms provided states
  [InputValid]: (state: Type) => Type;

  // Optionally, implement a function that returns true if the provided state is worth an event
  [InputChanged]: (state: Type, newState: Type) => boolean;

  // TODO Support params for nested inputs
  [inspect.custom](): string {
    return `${this[InputName]} ${this[InputIcon]}: ${JSON.stringify(
      this.state
    )}`;
  }

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

  // A name for this input
  readonly [InputName]: string;

  // A short name for this input
  readonly [InputIcon]: string;

  [InputChildless]: boolean = true;

  /**
   * Cascade events from nested Inputs.
   * And decide if this is the root Input.
   */
  [InputAdopt](): void {
    Object.values(this).forEach((value) => {
      if (value === this) return;
      if (value instanceof Input) {
        this[InputChildless] = false;
        if (!value[InputChildless]) return;
        value.on("change", (value) => {
          this.emit("change", this, value);
        });
        value.on("input", (value) => {
          this.emit("input", this, value);
        });
      }
    });
  }

  /**
   * Default comparison function for input state changes.
   */
  [InputChangedDefault](state: Type, newState: Type): boolean {
    if (state instanceof Input && state.id === this.id) return false;
    return state !== newState;
  }

  /**
   * Update the input's state and trigger all necessary callbacks.
   */
  [InputSet](state: Type): void {
    const newState =
      typeof this[InputValid] === "function" ? this[InputValid](state) : state;

    const stateChanged =
      typeof this[InputChanged] === "function"
        ? this[InputChanged](this.state, state)
        : this[InputChangedDefault];

    this.lastInput = Date.now();
    if (stateChanged) {
      this.state = newState;
      this.lastChange = Date.now();
      this.emit("change", this, this);
    }

    this.emit("input", this, this);
  }
}
