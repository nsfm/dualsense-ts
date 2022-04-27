export class Intensity {
  public readonly value: Uint8Array[0];
  public readonly maxed: boolean = false;
  public readonly resting: boolean = false;

  constructor(amount: number) {
    if (amount <= 0) {
      this.value = 0;
      this.resting = true;
    } else if (amount >= 255) {
      this.value = 255;
      this.maxed = true;
    } else {
      this.value = amount;
    }
  }

  public valueOf(): number {
    return this.value;
  }
}
