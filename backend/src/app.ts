import cors from "cors";
import express from "express";
import { router } from "./routes/index.js";
import { errorHandler } from "./shared/middlewares/error-handler.js";
import { notFoundHandler } from "./shared/middlewares/not-found.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_request, response) => {
  return response.json({
    message: "API AGK Desentupidora online.",
  });
});

app.use("/api", router);
app.use(notFoundHandler);
app.use(errorHandler);
