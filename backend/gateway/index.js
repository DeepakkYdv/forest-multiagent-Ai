import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import proxy from "express-http-proxy";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());//it is used to parse incoming JSON requests and make the data available in req.body
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true}
));
app.use(cookieParser());//it is used to parse cookies from the incoming requests and make them available in req.cookies
app.use("/auth",proxy("/auth", { target: "http://localhost:3000", changeOrigin: true }));

app.get('/',(req,res)=>{
    res.json({message:"hello from gateway!"})

})

app.listen(PORT,()=>{
    console.log(`gateway started at ${PORT}`)
})