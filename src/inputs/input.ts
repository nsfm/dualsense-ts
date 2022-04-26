import { EventEmitter } from "events";
import { inspect } from "util";

export interface InputParams {
  icon?: string;
}

export abstract class Input<Type>
  extends EventEmitter
  implements AsyncIterator<Input<Type>>
{
  public readonly id: symbol = Symbol();

  // If true, this input doesn't have any child inputs
  public root: boolean = true;

  // Provide the type and default value for the input.
  public abstract state: Type;

  // Implement a function that returns true if the user is actively engaged with the input.
  public abstract get active(): boolean;

  // Timestamp of the last received input, even if it didn't change the state.
  public lastInput: number = Date.now();

  // Timestamp of the last received input that changed the state.
  public lastChange: number = Date.now();

  // A nice string representing this input, for debugging.
  public readonly icon: string;

  [Symbol.asyncIterator](): AsyncIterator<this> {
    return this;
  }

  [inspect.custom](): string {
    return `${this.icon}: ${JSON.stringify(this.state)}`;
  }

  public valueOf(): Type {
    return this.state;
  }

  constructor({ icon }: InputParams) {
    super();
    this.icon = icon || "???";

    setImmediate(() => {
      this.adoptChildren();
    });
  }

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
  public promise(): Promise<IteratorResult<this>> {
    return new Promise<IteratorResult<this>>((resolve) => {
      this.once("change", resolve);
    });
  }

  /**
   * Cascade events from nested Inputs.
   * And decide if this is the root Input.
   */
  private adoptChildren(): void {
    Object.values(this).forEach((value) => {
      if (value === this) return;
      if (value instanceof Input) {
        this.root = false;
        if (!value.root) return;
        value.on("change", (value) => {
          this.emit("change", value);
        });
        value.on("input", (value) => {
          this.emit("input", value);
        });
      }
    });
  }

  /**
   * Render a convenient debugging string.
   */
  public toString(): string {
    return `${this.icon} [${this.active ? "X" : "_"}]`;
  }

  /**
   * Returns true if the new state warrants a state change.
   */
  public changes(state: Type): boolean {
    if (state instanceof Input) return this.id !== state.id;
    return this.state !== state;
  }

  /**
   * Update the input's state and trigger all necessary callbacks.
   */
  public set(state: Type): void {
    this.lastInput = Date.now();

    if (this.changes(state)) {
      this.state = state;
      this.lastChange = Date.now();
      this.emit("change", this);
    }

    this.emit("input", this);
  }
}
