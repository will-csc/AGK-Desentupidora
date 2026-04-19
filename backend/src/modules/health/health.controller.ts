import type { Request, Response } from "express";

export const getHealth = (_request: Request, response: Response) => {
  return response.status(200).json({
    status: "ok",
    service: "agk-desentupidora-backend",
    timestamp: new Date().toISOString(),
  });
};
