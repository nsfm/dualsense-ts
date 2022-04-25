import { EventEmitter } from "events";

export interface InputParams {
  icon?: string;
}

export abstract class Input<Type>
  extends EventEmitter
  implements AsyncIterator<Input<Type>>
{
  public readonly id: symbol = Symbol();

  // Provide the type and default value for the input.
  public abstract state: Type;

  // Implement a function that returns true if the user is actively engaged with the input.
  public abstract get active(): boolean;

  // Timestamp of the last received input, even if it didn't change the state.
  public lastInput: number = Date.now();

  // A nice string representing this input, for debugging.
  public readonly icon: string;

  // Generator promises waiting to be fulfilled.
  private waiting: ((res: IteratorResult<this>) => void)[] = [];

  [Symbol.asyncIterator](): AsyncIterator<this> {
    return this;
  }

  public valueOf(): Type {
    return this.state;
  }

  constructor({ icon }: InputParams) {
    super();
    this.icon = icon || "???";
  }

  /**
   * Resolves on the next update to this input's state.
   */
  public next(): Promise<IteratorResult<this>> {
    return new Promise<IteratorResult<this>>((resolve) => {
      this.waiting.push(resolve);
    });
  }

  /**
   * Fulfills pending promises
   */
  private notify(): void {
    this.waiting.forEach((resolve) => resolve({ value: this, done: false }));
    this.waiting = [];
  }

  /**
   * Render a convenient debugging string.
   */
  public toString(): string {
    return `${this.icon} [${this.active ? "X" : "_"}]`;
  }

  /**
   * Update the input's state and trigger all necessary callbacks.
   */
  public set(state: Type): void {
    this.lastInput = Date.now();

    if (this.state !== state) {
      this.state = state;
      this.emit("change", this);
      this.notify();
    }
    this.emit("input", this);
  }
}
