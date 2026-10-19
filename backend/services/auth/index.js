import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import { connectdb } from "./config/db.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3002;
app.use(express.json());
app.use("/", authRoutes);

app.listen(PORT, () => {
    console.log(`auth started at ${PORT}`);
    connectdb();
});