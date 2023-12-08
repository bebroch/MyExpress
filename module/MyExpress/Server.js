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
		}

		console.warn("Undefined module", module);
	}

	async getCallbackByRoute(httpReq, httpRes) {
		const callback = this.routers[httpReq.url];
		const res = new Response(httpRes);

		if (!callback) return res.notFound();

		try {
			await callback(httpReq, res);
		} catch (err) {
			console.error("Internal Server Error: " + err.message);
			res.internalError();
		}
	}

	async listen(port, callback) {
		this.createServer();
		this.app.listen(port, callback);
	}
}
