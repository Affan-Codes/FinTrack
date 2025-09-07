import "dotenv/config";
import "./config/passport.config";
import express from "express";
import cors from "cors";
import passport from "passport";
import { Env } from "./config/env.config";
import connectDB from "./config/database.config";
import authRoutes from "./routes/auth.route";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import userRoutes from "./routes/user.route";
import { passportAuthenticateJwt } from "./config/passport.config";
import transactionRoutes from "./routes/transaction.route";
import { initializeCrons } from "./crons";
import reportRoutes from "./routes/report.route";

const app = express();
const BASE_PATH = Env.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(
  cors({
    origin: Env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

// Routes
app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, passportAuthenticateJwt, userRoutes);
app.use(`${BASE_PATH}/transaction`, passportAuthenticateJwt, transactionRoutes);
app.use(`${BASE_PATH}/report`, passportAuthenticateJwt, reportRoutes);

app.use(errorHandler);

app.listen(Env.PORT, async () => {
  await connectDB();

  if (Env.NODE_ENV === "development") {
    await initializeCrons();
  }

  console.log(`Server is running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
});
