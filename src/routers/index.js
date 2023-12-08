import { Router } from "../../module/MyExpress/Router.js";
import home from "./home.js";

const router = new Router();

router.get("/api", (req, res) => {
	res.end("api");
});

router.use("/api", home);

export default router;
