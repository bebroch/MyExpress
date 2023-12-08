export class Response {
	constructor(res, method) {
		this.res = res;
		this.method = method;
	}

	static toString(data) {
		switch (typeof data) {
			case "object":
				return JSON.stringify(data);
			case "string":
				return JSON.stringify({ message: data });
			default:
				throw new Error("Invalid response data: " + data);
		}
	}

	// ---SEND---
	static send(res, statusCode, data) {
		const stringData = Response.toString(data);

		res.writeHead(statusCode, { "Content-Type": "application/json" });
		res.end(stringData);
	}

	send(statusCode, data) {
		const stringData = Response.toString(data);

		this.res.writeHead(statusCode, { "Content-Type": "application/json" });
		this.res.end(stringData);
	}

	// ---SUCCESS---
	static success(res, data = { message: "OK" }) {
		Response.send(res, 200, data);
	}

	success(data = { message: "OK" }) {
		this.send(200, data);
	}

	// ---BAD_REQUEST---
	static badRequest(res, data = { message: "Bad Request" }) {
		Response.send(res, 400, data);
	}

	badRequest(data = { message: "Bad Request" }) {
		this.send(400, data);
	}

	// ---NOT_FOUND---
	static notFound(res, data = { message: "Not Found" }) {
		Response.send(res, 404, data);
	}

	notFound(data = { message: "Not Found" }) {
		this.send(404, data);
	}

	// ---INTERNAL_ERROR---
	static internalError(res, data = { message: "Internal Error" }) {
		Response.send(res, 500, data);
	}

	internalError(data = { message: "Internal Error" }) {
		this.send(500, data);
	}
}
