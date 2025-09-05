import "dotenv/config";
import express from "express";
import cors from "cors";
import { Env } from "./config/env.config";
import connectDB from "./config/database.config";

const app = express();
const BASE_PATH = Env.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: Env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.listen(Env.PORT, async () => {
  await connectDB();

  // if (Env.NODE_ENV === "development") {
  // await initializeCrons();
  // }

  console.log(`Server is running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
});
