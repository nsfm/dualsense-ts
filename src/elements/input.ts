import { Subscription } from "./subscription";

export interface InputParams {
  icon?: string;
}

export abstract class Input<Type> {
  // Provide the type and default value for the input
  public abstract state: Type;

  // Implement a function that returns true if the user is actively engaged with the input.
  public abstract get active(): boolean;

  public readonly id: symbol = Symbol();

  public readonly icon: string;

  private subscriptions: Subscription<Input<Type>>[] = [];

  constructor({ icon }: InputParams) {
    this.icon = icon || "???";
  }

  public subscribe(
    func: (input: Input<Type>) => void
  ): Subscription<Input<Type>> {
    const subscription = new Subscription<Input<Type>>(this, func);
    this.subscriptions.push(subscription);
    return subscription;
  }

  public unsubscribe(subscription: Subscription<Type>): void {
    this.subscriptions = this.subscriptions.filter(
      (sub) => sub.id !== subscription.id
    );
  }

  toString(): string {
    return `${this.icon} [${this.active ? "X" : "_"}]`;
  }

  set(state: Type): void {
    this.state = state;
    this.subscriptions.forEach((subscription) => subscription.execute());
  }
}
