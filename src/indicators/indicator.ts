import { HID } from "node-hid";

import { Intensity } from "../math";

export class Indicator {
  public readonly brightness: Intensity = 0;

  public setColor([r, g, b]: Uint8Array, controller: HID): void {
    const command = Buffer.alloc(48, 0);

    const bytes: [value: number, offset: number][] = [
      [0x2, 0],
      [0x4, 2],
      [r, 45],
      [g, 46],
      [b, 47],
    ];

    bytes.forEach((byte: [value: number, offset: number]) =>
      command.writeInt8(...byte)
    );

    controller.write(command);
  }
}
