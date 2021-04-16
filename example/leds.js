const { 
	LedOptions,
	PulseOptions,
	Brightness,
} = require('../src/enums');

const DualSense = require('../src/DualSense');
const sleep = async (s) => new Promise(r => setTimeout(r, s));

const randomRgb = () => {
	var num = Math.round(0xffffff * Math.random());
	var r = num >> 16;
	var g = num >> 8 & 255;
	var b = num & 255;

	return [r, g, b];
};

(async () => {
	const controller = new DualSense(true);

	for (var i = 30; i >= 0; i--) {
		controller.changeColor(...randomRgb());
		await sleep(200);
	}
})();

