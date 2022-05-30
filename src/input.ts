import { EventEmitter } from "events";
import { inspect } from "util";

export interface InputParams {
  name?: string;
  icon?: string;
  threshold?: number;
  parent?: Input<unknown>;
}

/** @internal */
const InputDefaults: Omit<Required<InputParams>, "parent"> = {
  name: "???",
  icon: "???",
  threshold: 0,
};

/** @internal */
const InputAdopt = Symbol("InputAdopt");
/** @internal */
const InputChildless = Symbol("InputChildless");
/** @internal */
const InputParent = Symbol("InputParent");
/** @internal */
const InputSetComparison = Symbol("InputSetComparison");
/** @internal */
const InputChangedPrimitive = Symbol("InputChangedPrimitive");
/** @internal */
const InputChangedThreshold = Symbol("InputChangedThreshold");
/** @internal */
const InputChangedVirtual = Symbol("InputChangedVirtual");

/** @internal */
export const InputChanged = Symbol("InputChanged");
/** @internal */
export const InputSet = Symbol("InputSet");
/** @internal */
export const InputName = Symbol("InputName");
/** @internal */
export const InputIcon = Symbol("InputIcon");

export type InputEvent = "change" | "input" | "press" | "release";

/** @internal */
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
 * This class provides common a interface for all controller inputs.
 *
 * A set of nested Inputs forms an input tree. Input events are bubbled
 * up the tree, so subscribing to an input allows you to monitor all of its
 * children.
 */
export abstract class Input<Type>
  extends EventEmitter
  implements AsyncIterator<Input<Type>>
{
  public readonly id: symbol;

  /**
   * Timestamp of the last received input that changed the state.
   */
  public lastChange: number = Date.now();

  /**
   * Timestamp of the last received input, even if it didn't change the state.
   */
  public lastInput: number = Date.now();

  /**
   * Ignore state changes smaller than this threshold (numeric inputs only).
   */
  public threshold: number = 0;

  /**
   * @internal
   * Provide the type and default value for the input.
   */
  public abstract state: Type;

  /**
   * Returns true if the user is actively engaged with the input.
   */
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

  /** @internal */
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

    this[InputChanged] = this[InputSetComparison]();
    setImmediate(() => {
      this[InputAdopt]();
      this[InputChanged] = this[InputSetComparison]();
    });
  }

  /**
   * @internal
   * Optionally, implement a function that returns true if the provided state is worth an event
   */
  [InputChanged]: (state: Type, newState: Type) => boolean;

  /** @internal */
  [inspect.custom](): string {
    return `${this[InputName]} ${this[InputIcon]}: ${JSON.stringify(
      this.state instanceof Input && this.state.id === this.id
        ? "virtual"
        : this.state
    )}`;
  }

  /** @internal */
  [Symbol.asyncIterator](): AsyncIterator<this> {
    return this;
  }

  /** @internal */
  [Symbol.toPrimitive](hint: "number" | "string" | "default"): number | string {
    if (hint === "string") return String(this.state);
    if (typeof this.state === "number") return this.state;
    return Number(this.state);
  }

  /** @internal */
  get [Symbol.toStringTag](): string {
    return this.toString();
  }

  /**
   * @internal
   * A name for this input
   */
  readonly [InputName]: string;

  /**
   * @internal
   * A short name for this input
   */
  readonly [InputIcon]: string;

  /** @internal */
  [InputParent]?: Input<unknown>;

  /** @internal */
  [InputChildless]: boolean = true;

  /**
   * @internal
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

  /** @internal */
  [InputChangedVirtual](): boolean {
    return true;
  }

  /** @internal */
  [InputChangedPrimitive](state: Type, newState: Type): boolean {
    return state !== newState;
  }

  /** @internal */
  [InputChangedThreshold](state: number, newState: number): boolean {
    return Math.abs(state - newState) > this.threshold;
  }

  /**
   * @internal
   * Sets a default comparison type for the Input based on the generic type.
   */
  [InputSetComparison](): (state: Type, newState: Type) => boolean {
    if (typeof this.state === "number") {
      return this[InputChangedThreshold] as unknown as (
        state: Type,
        newState: Type
      ) => boolean;
    } else if (this.state instanceof Input) {
      return this[InputChangedVirtual];
    } else {
      return this[InputChangedPrimitive];
    }
  }

  /**
   * @internal
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
