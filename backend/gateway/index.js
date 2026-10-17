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
    origin: "http://localhost:5173",
    credentials: true}
));
app.use(cookieParser());//it is used to parse cookies from the incoming requests and make them available in req.cookies

app.use(
  "/auth",
  proxy("http://localhost:8001", {
    proxyReqPathResolver: (req) => {
      return `/auth${req.url}`;
    },
  })
);


app.listen(PORT,()=>{
    console.log(`gateway started at ${PORT}`)
})