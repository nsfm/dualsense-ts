export type Subscriber<InputType> = (input: InputType) => void;

export class Subscription<InputType> {
  public readonly id = Symbol();

  constructor(
    public readonly input: InputType,
    public readonly callback: Subscriber<InputType>
  ) {}

  execute(): void {
    this.callback(this.input);
  }
}
