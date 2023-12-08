import { Router } from "../../module/MyExpress/Router.js";

const router = new Router();

router.get(
	"/v3",
	(req, res, next) => {
		res.notFound();
		next();
	},
	(req, res) => {
		res.success("v3");
	}
);

export default router;
