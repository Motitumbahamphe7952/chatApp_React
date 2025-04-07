import express from "express";
import cors from "cors";
import { port, frontend_url } from "./src/constant.js";
import connectToMongoDb from "./src/config/connectToMongoDb.js";
import { router } from "./src/routes/route.js";
import cookieParser from "cookie-parser";
import { app, server } from "./src/socket/socket.js";

// const app = express();
app.use(
  cors({
    origin: [
      "https://chat-app-react-nikhil.vercel.app",
      "https://chat-app-react-taupe.vercel.app",
      "https://reactchatapp.motitumbahamphe.com.np",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const Port = port;

app.use("/api", router);

connectToMongoDb().then(() => {
  server.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
  });
});

app.get("/", (req, res) => {
  res.send(`Hello World!!!... this is server running on port ${Port}`);
});
