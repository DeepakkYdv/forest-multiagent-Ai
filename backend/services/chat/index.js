import "dotenv/config"
import express from "express";
import { connectdb } from "./config/db.js";
import router from "./routes/chat.routes.js";

const app = express();
const PORT = process.env.PORT || 8002;
app.use(express.json());
app.use("/", router);

app.listen(PORT, () => {
    console.log(`chat started at ${PORT}`);
    connectdb();
});