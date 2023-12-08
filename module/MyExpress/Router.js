export class Router {
	constructor() {
		this.routes = [];
	}

	getRoutes() {
		return this.routes;
	}

	push(url, callback) {
		this.routes.push({ url, callback });
	}

	use(url, callback) {
		if (typeof callback === "function") {
			this.push(url, callback);
		}

		if (callback instanceof Router) {
			callback.routes.forEach(item => {
				this.push(url + item.url, item.callback);
			});
		}
	}

	get(url, callback) {
		this.push(url, callback);
	}

	post(url, callback) {}
}
