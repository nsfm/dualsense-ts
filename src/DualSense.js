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

 	close() {
 		this.controller.close()
 	}
	
	on(type, callback) {
		if (!['data', 'error'].includes(type)) {
			throw new Error('invalid type');
		}

		if (this.verbose) {
			console.log(`[on][${type}] add callback`);
		}

		return this.controller.on(type, callback);
	}

	sendData(data) {
		if (this.verbose) {
			console.log(`[sendData]`, data);
		}

		return this.controller.write(data);
	}

	call(data, sendData) {
		const packets = new Array(48).fill(0);
		for (const i in data) {
			const [index, value] = data[i];
			packets[index] = value;
		}

		if (sendData) {
			return this.sendData(packets);			
		}

		return packets;
	}

	setColor(r, g, b, sendData = true) {
		if( (r > 255 || g > 255 || b > 255) || (r < 0 || g < 0 || b < 0) ){
			throw new Error('Colors have values from 0 to 255 only');
		}

		return this.call([
			[0, 0x2],
			[2, 0x4],
			[45, r],
			[46, g],
			[47, b],
		], sendData);
	}
};

module.exports = DualSense;