import http from "http";
import { Response } from "./Response.js";
import { Router } from "./Router.js";

export class MyExpress {
	constructor() {
		this.routers = {};
		this.app = http.Server();
	}

	createServer() {
		this.app = http.createServer((req, res) =>
			this.getCallbackByRoute(req, res)
		);
	}

	use(module) {
		if (module instanceof Router) {
			this.routers = Router.parse(module);
			return;
		}

		console.warn("Undefined module", module);
	}

	async getCallbackByRoute(httpReq, httpRes) {
		if (!this.routers[httpReq.url]) return Response.notFound(httpRes);

		const { callback, middlewares, method } = this.routers[httpReq.url];
		const res = new Response(httpRes, method);

		try {
			this.sendMiddlewareAndCallback(httpReq, res, middlewares, callback);
		} catch (err) {
			console.error("Internal Server Error: " + err.message);
			res.internalError();
		}
	}

	async sendMiddlewareAndCallback(httpReq, res, middlewares, callback) {
		if (middlewares.length === 0) return await callback(httpReq, res);

		middlewares.forEach((middleware, index) => {
			const nextMiddleware = middlewares[index + 1];

			if (nextMiddleware) middleware(httpReq, res, nextMiddleware);
			middleware(httpReq, res, async () => callback(httpReq, res));
		});
	}

	async listen(port, callback) {
		this.createServer();
		this.app.listen(port, callback);
	}
}
