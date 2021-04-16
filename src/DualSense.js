const HID = require('node-hid');

class DualSense {
 	constructor(verbose = false) {
 		this.verbose = verbose;
		const devices = HID.devices();

		const device = devices.find(({ productId, vendorId }) => productId === 3302 && vendorId === 1356);

		if (null === device) {
			throw new Error('No controller detected');
		}
		
		this.controller = new HID.HID(device.path);
		if (this.verbose) {
			console.log('[contructor]', this.controller.getDeviceInfo());
		}
 	}
	
	sendData(data) {
		if (this.verbose) {
			console.log(`[sendData]`, data);
		}

		return this.controller.write(data);
	}

	setColor(r, g, b) {
		if( (r > 255 || g > 255 || b > 255) || (r < 0 || g < 0 || b < 0) ){
			throw new Error('Colors have values from 0 to 255 only');
		}
		
		const data = new Array(48).fill(0);
		// packet type
		data[0] = 0x2;
		// 0x04 toggling LED strips on the sides of the touchpad
		data[2] = 0x4;
		
		data[45] = r;
		data[46] = g;
		data[47] = b;

		this.sendData(data);
	}

};

module.exports = DualSense;