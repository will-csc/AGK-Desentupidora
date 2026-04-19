import type { Request, Response } from "express";

export const notFoundHandler = (_request: Request, response: Response) => {
  return response.status(404).json({
    message: "Rota nao encontrada.",
  });
};
