export class Runner {
	constructor() {
		this.queue = [];
	}
	/**
	 * 加入一个回调函数到执行队列
	 * @param { Function } callback 回调函数
	 * @returns { Function } remove函数 从队列中移除回调
	 */
	push (callback) {
		const i = this.queue.push(callback) - 1;
		return () => this.queue.splice(i,1);
	}
	/**
	 * 执行回调队列中的回调函数
	 * @param  {...any} params 回调参数
	 */
	run (...params) {
		if (this.queue.length > 0) {
			this.queue.forEach((fn) => fn(...params));
		}
	}
	remove (callback) {
		const index = this.queue.findIndex((cb) => cb === callback);
		if (index > -1) {
			this.queue.splice(index,1);
			return true;
		} else {
			return false;
		}
	}
}
