import { EventEmitter } from "events";
import { inspect } from "util";

export interface InputParams {
  name?: string;
  icon?: string;
  threshold?: number;
  parent?: Input<unknown>;
}

const InputDefaults: Omit<Required<InputParams>, "parent"> = {
  name: "???",
  icon: "???",
  threshold: 0,
};

// Private properties
const InputAdopt = Symbol("InputAdopt");
const InputChildless = Symbol("InputChildless");
const InputParent = Symbol("InputParent");
const InputSetComparison = Symbol("InputSetComparison");
const InputChangedPrimitive = Symbol("InputChangedPrimitive");
const InputChangedThreshold = Symbol("InputChangedThreshold");
const InputChangedVirtual = Symbol("InputChangedVirtual");

// Optional abstract properties
export const InputChanged = Symbol("InputChanged");

// Utilities
export const InputSet = Symbol("InputSet");
export const InputName = Symbol("InputName");
export const InputIcon = Symbol("InputIcon");

export type InputEvent = "change" | "input" | "press" | "release";

export declare interface Input<Type> {
  on(
    event: InputEvent,
    listener: (
      input: Input<Type>,
      changed: Input<unknown>
    ) => unknown | Promise<unknown>
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

  // For numeric inputs, ignore state changes smaller than this threshold.
  public threshold: number = 0;

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

    const { icon, name, parent, threshold } = {
      ...InputDefaults,
      ...(params || {}),
    };
    this[InputName] = name;
    this[InputIcon] = icon;
    this[InputParent] = parent;

    this.threshold = threshold;
    this.id = Symbol(this[InputName]);

    this[InputSetComparison]();
    setImmediate(() => {
      this[InputAdopt]();
      this[InputSetComparison]();
    });
  }

  // Optionally, implement a function that returns true if the provided state is worth an event
  [InputChanged]: (state: Type, newState: Type) => boolean;

  // TODO Support params for nested inputs
  [inspect.custom](): string {
    return `${this[InputName]} ${this[InputIcon]}: ${JSON.stringify(
      this.state instanceof Input && this.state.id === this.id
        ? "virtual"
        : this.state
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

  // The Input's parent, if any
  [InputParent]?: Input<unknown>;

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
        value.on("change", (that, value) => {
          that;
          this.emit("change", this, value);
        });
        value.on("input", (that, value) => {
          that;
          this.emit("input", this, value);
        });
      }
    });
  }

  [InputChangedVirtual](): boolean {
    return true;
  }

  [InputChangedPrimitive](state: Type, newState: Type): boolean {
    return state !== newState;
  }

  [InputChangedThreshold](state: number, newState: number): boolean {
    return Math.abs(state - newState) > this.threshold;
  }

  // Sets a default comparison type for the Input based on the generic type.
  [InputSetComparison](): void {
    if (typeof this.state === "number") {
      this[InputChanged] = this[InputChangedThreshold] as unknown as (
        state: Type,
        newState: Type
      ) => boolean;
    } else if (this.state instanceof Input) {
      this[InputChanged] = this[InputChangedVirtual];
    } else {
      this[InputChanged] = this[InputChangedPrimitive];
    }
  }

  /**
   * Update the input's state and trigger all necessary callbacks.
   */
  [InputSet](state: Type): void {
    this.lastInput = Date.now();
    if (this[InputChanged](this.state, state)) {
      this.state = state;
      this.lastChange = Date.now();
      this.emit("change", this, this);
      if (typeof state === "boolean") {
        state
          ? this.emit("press", this, this)
          : this.emit("release", this, this);
      }
    }

    this.emit("input", this, this);
  }
}
