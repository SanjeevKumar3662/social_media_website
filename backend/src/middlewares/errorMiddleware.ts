import { Request, Response, NextFunction } from "express";

export const errorMiddleware = () => {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    const statusCode = err.status || err.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      message:
        process.env.MODE === "DEV" ? err.message : "Internal Server Error",
      ...(process.env.MODE === "DEV" && { stack: err.stack }),
    });
  };
};
