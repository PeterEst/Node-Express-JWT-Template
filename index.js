import * as dotenv from "dotenv";
import express, { json } from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./Routes/AuthRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET,POST"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(json());
app.use("/", authRoutes);

// process.env.MONGO_CONNECT
mongoose
  .connect("mongodb://localhost:27017/fitness-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(`Error connecting to MongoDB: ${err}`);
  });

app.listen(3300, () => {
  console.log("Server is running on port 3300");
});
