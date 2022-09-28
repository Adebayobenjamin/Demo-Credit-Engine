import { NextFunction, Request, Response } from "express";
import { ResponseData, ResponseError } from "../../core/common/Response";
import { jwt } from "../../core/utils/jwt";

export const requiresAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers.authorization;
  if (!token) {
    const error = new ResponseError({
      statusCode: 401,
      message: "unauthorized",
    });
    return res.status(401).json(
      new ResponseData({
        status: false,
        error,
      })
    );
  }
  token = token.replace("Bearer ", "");
  const decodedToken = jwt.decodeToken(token);
  if (!decodedToken) {
    const error = new ResponseError({
      statusCode: 401,
      message: "unauthorized",
    });
    return res.status(401).json(
      new ResponseData({
        status: false,
        error,
      })
    );
  }

  req["user"] = decodedToken["userId"];
  next();
};
