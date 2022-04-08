import { DualSense } from "../src/dualsense";

async function sleep(duration: number): Promise<void> {
  return new Promise((r) => setTimeout(r, duration));
}

function randomRgb(): Uint8Array {
  var num = Math.round(0xffffff * Math.random());
  var r = num >> 16;
  var g = (num >> 8) & 255;
  var b = num & 255;

  return new Uint8Array([r, g, b]);
}

(async () => {
  const controller = new DualSense();

  for (var i = 30; i >= 0; i--) {
    controller.setColor(randomRgb());
    await sleep(200);
  }
})();
