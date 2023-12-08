export class Response {
	constructor(res) {
		this.res = res;
	}

	toString(data) {
		switch (typeof data) {
			case "object":
				return JSON.stringify(data);
			case "string":
				return JSON.stringify({ message: data });
			default:
				throw new Error("Invalid response data: " + data);
		}
	}

	send(statusCode, data) {
		const stringData = this.toString(data);

		this.res.writeHead(statusCode, { "Content-Type": "application/json" });
		this.res.end(stringData);
	}

	success(data = { message: "OK" }) {
		this.send(200, data);
	}

	badRequest(data = { message: "Bad Request" }) {
		this.send(400, data);
	}

	notFound(data = { message: "Not Found" }) {
		this.send(404, data);
	}

	internalError(data = { message: "Internal Error" }) {
		this.send(500, data);
	}
}
