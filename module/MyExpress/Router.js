function parseHandler(handlers) {
	const callback = handlers.pop();
	const middleware = handlers;

	return {
		callback,
		middleware,
	};
}

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

	push(url, callback, middlewares, method) {
		this.routes[url] = { callback, middlewares, method };
	}

	pushHandler(url, handlers, method) {
		const { callback, middleware } = parseHandler(handlers);

		if (typeof callback === "function")
			this.pushCallback(url, callback, middleware, method);

		if (callback instanceof Router)
			this.pushRouter(url, callback, middleware, method);
	}

	pushCallback(url, callback, middlewares, method) {
		this.push(url, callback, middlewares, method);
	}

	pushRouter(url, callback, middlewares, method) {
		const routes = callback.routes;
		const chilesUrls = Object.keys(routes);

		for (const childUrl of chilesUrls) {
			const {
				callback: childCallback,
				middlewares: childMiddlewares,
				method: childMethod,
			} = routes[childUrl];
			this.push(
				url + childUrl,
				childCallback,
				childMiddlewares,
				childMethod
			);
		}
	}

	use(url, ...handlers) {
		this.pushHandler(url, handlers, "all");
	}

	get(url, ...handlers) {
		this.pushHandler(url, handlers, "get");
	}

	post(url, callback) {
		this.pushHandler(url, handlers, "post");
	}
}
