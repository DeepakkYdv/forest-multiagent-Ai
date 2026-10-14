import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
app.use(express.json());
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({ message: "hello from auth" });
});

app.listen(PORT, () => {
    console.log(`auth started at ${PORT}`);
});