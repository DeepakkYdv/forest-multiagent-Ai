import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import { connectdb } from "./config/db.js";
import CORS from "cors";
dotenv.config();

const app = express();
app.use(CORS({
    origin: "http://localhost:5173",
    credentials: true
}));
const PORT = process.env.PORT || 3002;
app.use(express.json());
app.use("/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`auth started at ${PORT}`);
    connectdb();
});