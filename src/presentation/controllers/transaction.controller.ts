import { NextFunction, Request, Response } from "express";
import {  } from "tsyringe";
import { ResponseData } from "../../core/common/Response";
import { ICreateTransactionUseCase } from "../../domain/interfaces/useCases/transaction/createTransaction.useCase";
import { IGetTransactionsByUserIdUseCase } from "../../domain/interfaces/useCases/transaction/getTransactionsByUserId.useCase";


export class TransactionController {
  getTransactionsByUserIdUseCase: IGetTransactionsByUserIdUseCase;
  constructor(getTransactionsByUserIdUseCase: IGetTransactionsByUserIdUseCase) {
    this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase;
  }
  async getTransactionsByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const transactions = await this.getTransactionsByUserIdUseCase.execute(
        req["user"]
      );
      return res.status(200).json(
        new ResponseData({
          status: true,
          data: transactions,
        })
      );
    } catch (error) {
      next(error);
    }
  }
}
