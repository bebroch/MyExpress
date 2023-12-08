import { Router } from "../../module/MyExpress/Router.js";
import home from "./home.js";

const router = new Router();

router.get("/api", (req, res) => {
	res.success("Это метод API");
});

router.use("/api", home);

export default router;
