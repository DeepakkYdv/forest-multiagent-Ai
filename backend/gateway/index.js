import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import proxy from "express-http-proxy";
import protect from "./middlewere/protect.js";
import getCurrentuser from "./controllers/user.controller.js";
import proxyWithHeader from "./lib/proxywithheader.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());//it is used to parse incoming JSON requests and make the data available in req.body
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  credentials: true,
}
));
app.use(cookieParser());//it is used to parse cookies from the incoming requests and make them available in req.cookies

app.use(
  "/api/v1/auth",
  proxy(process.env.AUTH_SERVICE_URL || "http://localhost:8001", {
    proxyReqPathResolver: (req) => {
      return req.url;
    },
  })
);
app.use(
  "/api/v1/user",
  protect, getCurrentuser)

app.use("/api/v1/chat",protect,
  proxyWithHeader(process.env.CHAT_SERVICE_URL)
);

app.use("/api/v1/agent",protect,
  proxyWithHeader(process.env.AGENT_SERVICE_URL)
);

app.listen(PORT, () => {
  console.log(`gateway started at ${PORT}`)
})
