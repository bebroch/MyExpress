import http from "http";
import { Router } from "../../module/MyExpress/Router.js";
import { Response } from "./Response.js";

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
		const { callback, middlewares, method } = this.routers[httpReq.url];
		console.log(this.routers[httpReq.url]);
		const res = new Response(httpRes, method);

		if (!callback) return res.notFound();

		try {
			await Promise.all(
				this.sendMiddlewareAndCallback(
					httpReq,
					res,
					middlewares,
					callback
				)
			);
		} catch (err) {
			console.error("Internal Server Error: " + err.message);
			res.internalError();
		}
	}

	async sendMiddlewareAndCallback(httpReq, res, middlewares, callback) {
		if (middlewares.length === 0) {
			return await callback(httpReq, res);
		}

		for (let i = 0; i < middlewares.length; i++) {
			const middleware = middlewares[i];
			const nextMiddleware = middlewares[i + 1];

			if (nextMiddleware) {
				await Promise.all(middleware(httpReq, res, nextMiddleware));
			}

			await Promise.all(
				await middleware(httpReq, res, async () => {
					try {
						callback(httpReq, res);
					} catch (err) {
						console.log("ERROR");
					}
				})
			);
		}
	}

	async listen(port, callback) {
		this.createServer();
		this.app.listen(port, callback);
	}
}
