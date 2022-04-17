export type Subscriber<InputType> = (input: InputType) => void;

export class Subscription<InputType> {
  public readonly id = Symbol();

  constructor(
    public readonly input: InputType,
    public readonly callback: Subscriber<InputType>,
    private readonly unsubscribe: (
      subscription: Subscription<InputType>
    ) => void
  ) {}

  public execute(): void {
    this.callback(this.input);
  }

  public cancel(): void {
    this.unsubscribe(this);
  }
}
