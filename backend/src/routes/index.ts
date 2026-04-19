import { Router } from "express";
import { getHealth } from "../modules/health/health.controller.js";

export const router = Router();

router.get("/health", getHealth);
