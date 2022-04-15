import { Subscription } from "./subscription";

export interface InputParams {
  icon?: string;
}

export abstract class Input<Type> implements AsyncIterator<Type> {
  public readonly id: symbol = Symbol();

  // Provide the type and default value for the input.
  public abstract state: Type;

  // Implement a function that returns true if the user is actively engaged with the input.
  public abstract get active(): boolean;

  // Timestamp of the last received input, even if it didn't change the state.
  public lastInput: number = Date.now();

  // A nice string representing this input, for debugging.
  public readonly icon: string;

  // Registered callbacks.
  private subscriptions: Subscription<Input<Type>>[] = [];

  // Generator promises waiting to be fulfilled.
  private waiting: ((res: IteratorResult<Type>) => void)[] = [];

  // Inputs are async interators.
  [Symbol.asyncIterator](): AsyncIterator<Type> {
    return this;
  }

  constructor({ icon }: InputParams) {
    this.icon = icon || "???";
  }

  /**
   * Resolves on the next update to this input's state.
   */
  next(): Promise<IteratorResult<Type>> {
    return new Promise<IteratorResult<Type>>((resolve) => {
      this.waiting.push(resolve);
    });
  }

  /**
   * Register a callback to run when an input changes.
   */
  public subscribe(
    callback: (input: Input<Type>) => void
  ): Subscription<Input<Type>> {
    const subscription = new Subscription<Input<Type>>(this, callback);
    this.subscriptions.push(subscription);
    return subscription;
  }

  /**
   * Unregister a previous subscription.
   */
  public unsubscribe(subscription: Subscription<Type>): void {
    this.subscriptions = this.subscriptions.filter(
      (sub) => sub.id !== subscription.id
    );
  }

  /**
   * Trigger all Subscriptions.
   */
  private notifySubscribers(): void {
    this.subscriptions.forEach((subscription) => subscription.execute());
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
      this.waiting.forEach((resolve) => resolve({ value: state, done: false }));
      this.waiting = [];
    }

    this.notifySubscribers();
  }
}
