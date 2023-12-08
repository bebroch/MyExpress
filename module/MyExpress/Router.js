export class Router {
	constructor() {
		this.routes = {};
	}

	static getRoutes() {
		return this.routes;
	}

	static parse(routes) {
		return routes.routes;
	}

	push(url, callback) {
		this.routes[url] = callback;
	}

	use(url, callback) {
		if (typeof callback === "function") {
			this.push(url, callback);
		}

		if (callback instanceof Router) {
			const routes = callback.routes;
			const chilesUrls = Object.keys(routes);

			for (const childUrl of chilesUrls) {
				const callback = routes[childUrl];
				this.push(url + childUrl, callback);
			}
		}
	}

	get(url, callback) {
		this.push(url, callback);
	}

	post(url, callback) {}
}
