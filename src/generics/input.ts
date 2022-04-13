import { InputId } from "../elements/inputs";
import { Binding } from "./binding";

export interface InputParams {
  id: InputId;
  icon: string;
}

export abstract class Input<Type> {
  public abstract state: Type;

  public abstract defaultState: Type;

  public active: boolean = false;

  public readonly id: InputId;

  public readonly icon: string;

  private bindings: Binding<Input<Type>>[] = [];

  constructor({ id, icon }: InputParams) {
    this.id = id;
    this.icon = icon;
  }

  public bind(func: (input: Input<Type>) => void): Binding<Input<Type>> {
    const binding = new Binding<Input<Type>>(this, func);
    this.bindings.push(binding);
    return binding;
  }

  public unbind(binding: Binding<Type>): void {
    this.bindings = this.bindings.filter((bound) => bound.id !== binding.id);
  }

  toString(): string {
    return `${this.icon} [${this.active ? "X" : "_"}]`;
  }

  set(state: Type): void {
    this.state = state;
    this.active = this.state !== this.defaultState;
    this.bindings.forEach((binding) => binding.execute());
  }
}
