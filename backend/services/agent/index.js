import "dotenv/config";
import express from "express";
import { connectdb } from "./config/db.js";
import router from "./router/agent.route.js";

const app = express();
const PORT = process.env.PORT || 8003;
app.use(express.json());
app.use("/", router);

app.listen(PORT, () => {
    console.log(`agent started at ${PORT}`);
    connectdb();
});