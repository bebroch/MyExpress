import { MyExpress } from "../module/MyExpress/Server.js";
import router from "./routers/index.js";
const PORT = 3000;

const app = new MyExpress();

app.use(router);

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
