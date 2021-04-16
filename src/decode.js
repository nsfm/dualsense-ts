
const decode = (buffer) => {
	// convert bytes to list
	const states = [...buffer] 
	const state = {
		LX: null,
		LY: null,
		RX: null,
		RY: null,
		L2: null,
		R2: null,
		triangle: null,
		circle: null,
		cross: null,
		square: null,
		dPadState: null,
		R3: null,
		L3: null,
		options: null,
		share: null,
		R2Btn: null,
		L2Btn: null,
		R1: null,
		L1: null,
		ps: null,
		touchBtn: null,
		micBtn: null,
	};

	// states 0 is always 1
	state.LX = states[1] - 127
	state.LY = states[2] - 127
	state.RX = states[3] - 127
	state.RY = states[4] - 127
	state.L2 = states[5]
	state.R2 = states[6]

	// state 7 always increments -> not used anywhere

	buttonState = states[8]
	state.triangle = (buttonState & (1 << 7)) != 0
	state.circle = (buttonState & (1 << 6)) != 0
	state.cross = (buttonState & (1 << 5)) != 0
	state.square = (buttonState & (1 << 4)) != 0


	// dpad
	state.dPadState = buttonState & 0x0F;

	misc = states[9]
	state.R3 = (misc & (1 << 7)) != 0
	state.L3 = (misc & (1 << 6)) != 0
	state.options = (misc & (1 << 5)) != 0
	state.share = (misc & (1 << 4)) != 0
	state.R2Btn = (misc & (1 << 3)) != 0
	state.L2Btn = (misc & (1 << 2)) != 0
	state.R1 = (misc & (1 << 1)) != 0
	state.L1 = (misc & (1 << 0)) != 0

	misc2 = states[10]
	state.ps = (misc2 & (1 << 0)) != 0
	state.touchBtn = (misc2 & 0x02) != 0
	state.micBtn = (misc2 & 0x04) != 0

	return state;
};

module.exports = decode;