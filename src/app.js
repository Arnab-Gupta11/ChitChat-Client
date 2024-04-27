import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
const app = express();
app.use(express.json());

// Routes
app.use("/api/v1/users", userRoutes);

export { app };
