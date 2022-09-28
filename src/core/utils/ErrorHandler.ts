import { NextFunction, Request, Response } from "express";
import { ResponseData, ResponseError } from "../common/Response";

export default function ErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const error = new ResponseError({
    statusCode: err.statusCode || 500,
    message: err.message || err.msg || "Something went wrong",
    validationErrors: err.validationErrors || [],
  });
console.log(err)
  res.status(error.statusCode).json(
    new ResponseData({
      status: false,
      error,
    })
  );
}
