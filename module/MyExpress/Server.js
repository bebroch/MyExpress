import http from "http";
import { Router } from "../../module/MyExpress/Router.js";

export class MyExpress {
	constructor() {
		this.routers = [];
		this.app = http.Server();
	}

	createServer() {
		this.app = http.createServer((req, res) => {
			console.log(this.routers);

			this.routers.forEach(route =>
				this.getCallbackByRoute(route.url, route.callback, req, res)
			);
		});
	}

	getCallbackByRoute(url, callback, req, res) {
		if (req.url === url) {
			try {
				callback(req, res);
			} catch (err) {
				res.statusCode = 500;
				res.end();
			}
		}
	}

	use(module) {
		if (module instanceof Router) {
			module.getRoutes().forEach(item => {
				this.routers.push(item);
			});
			console.log(this.routers);
		}
	}

	listen(port, callback) {
		this.createServer();
		this.app.listen(port, callback);
	}
}
