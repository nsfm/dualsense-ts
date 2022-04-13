export type BoundFn<InputType> = (input: InputType) => void;

export class Binding<InputType> {
  public readonly id = Symbol();

  constructor(
    public readonly input: InputType,
    public readonly callback: BoundFn<InputType>
  ) {}

  execute(): void {
    return this.callback(this.input);
  }
}
