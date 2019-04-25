export class Semaphore {

	limit: number;
	kQueue: any[];
	kUsed: number;

	constructor(limit: number = 1) {
		if (typeof limit !== 'number') {
			throw new TypeError(`Expected limit to be a number, got ${typeof limit}`);
		}

		if (limit < 1) {
			throw new Error('limit cannot be less than 1');
		}

		this.limit = limit;
		this.kQueue = [];
		this.kUsed = 0;
	}

	aquire(): Promise<any> {
		if (this.kUsed < this.limit) {
			this.kUsed += 1;
			return Promise.resolve();
		}

		return new Promise((resolve) => {
			this.kQueue.push(resolve);
		});
	}

	release() {
		if (this.kQueue.length) {
			this.kQueue.shift()();
		} else {
			this.kUsed -= 1;
		}
	}

	use(fn) {
		return this.aquire().then(fn).then(
			(value) => { this.release(); return value; },
			(error) => { this.release(); throw error; }
		);
	}
}