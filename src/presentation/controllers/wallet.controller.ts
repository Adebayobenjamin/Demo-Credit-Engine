import { NextFunction, Response, Request } from "express";
import { ResponseData } from "../../core/common/Response";
import { TransactionType } from "../../domain/entities/transaction.entity";
import { ICreateTransactionUseCase } from "../../domain/interfaces/useCases/transaction/createTransaction.useCase";
import { IGetTransactionsByUserIdUseCase } from "../../domain/interfaces/useCases/transaction/getTransactionsByUserId.useCase";
import { IGetUserByIdUseCase } from "../../domain/interfaces/useCases/user/getUserById.useCase";
import { ICreateWalletUseCase } from "../../domain/interfaces/useCases/wallet/createWallet.useCase";
import { IFundWalletUseCase } from "../../domain/interfaces/useCases/wallet/fundWallet.useCase";
import { IGetWalletByUserIdUseCase } from "../../domain/interfaces/useCases/wallet/getWalletByUserId.useCase";
import { ITransferUseCase } from "../../domain/interfaces/useCases/wallet/transfer.useCase";
import { IWithdrawUseCase } from "../../domain/interfaces/useCases/wallet/withdraw.useCase";
import { InitiateFundingUseCase } from "../../domain/useCases/wallet/initiateFunding.useCase";
import crypto from "crypto";
import { IGetBanksUseCase } from "../../domain/interfaces/useCases/wallet/getBanks.useCase";
import { IVerifyAccountNumberUseCase } from "../../domain/interfaces/useCases/wallet/verifyAccountNumber.useCase";
import { IInitiateWithdrawalUseCase } from "../../domain/interfaces/useCases/wallet/initiateWithdrawal.useCase";
export class WalletController {
  fundWalletUseCase: IFundWalletUseCase;
  getWalletByUserIdUseCase: IGetWalletByUserIdUseCase;
  initiateFundingUseCase: InitiateFundingUseCase;
  transferUseCase: ITransferUseCase;
  withdrawUseCase: IWithdrawUseCase;
  getUserByIdUseCase: IGetUserByIdUseCase;
  getBanksUseCase: IGetBanksUseCase;
  verifyAccountNumberUseCase: IVerifyAccountNumberUseCase;
  initiateWithdrawalUseCase: IInitiateWithdrawalUseCase;
  // createTransactionUseCase: ICreateTransactionUseCase;
  constructor(
    fundWalletUseCase: IFundWalletUseCase,
    getWalletByUserIdUseCase: IGetWalletByUserIdUseCase,
    initiateFundingUseCase: InitiateFundingUseCase,
    transferUseCase: ITransferUseCase,
    withdrawUseCase: IWithdrawUseCase,
    getUserByIdUseCase: IGetUserByIdUseCase,
    getBanksUseCase: IGetBanksUseCase,
    verifyAccountNumberUseCase: IVerifyAccountNumberUseCase,
    initiateWithdrawalUseCase: IInitiateWithdrawalUseCase
    // createTransactionUseCase: ICreateTransactionUseCase
  ) {
    this.fundWalletUseCase = fundWalletUseCase;
    this.getWalletByUserIdUseCase = getWalletByUserIdUseCase;
    this.initiateFundingUseCase = initiateFundingUseCase;
    this.transferUseCase = transferUseCase;
    this.withdrawUseCase = withdrawUseCase;
    this.getUserByIdUseCase = getUserByIdUseCase;
    this.getBanksUseCase = getBanksUseCase;
    this.verifyAccountNumberUseCase = verifyAccountNumberUseCase;
    this.initiateWithdrawalUseCase = initiateWithdrawalUseCase;
    // this.createTransactionUseCase = createTransactionUseCase;
  }

  paymentWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      const hash = crypto
        .createHmac("sha512", process.env.PAYSTACK_PRIVATE_KEY)
        .update(JSON.stringify(req.body))
        .digest("hex");
      if (hash == req.headers["x-paystack-signature"]) {
        const event = req.body.event;
        const result =
          event == "charge.success"
            ? await this.fundWalletUseCase.execute(
                req.body.data.amount / 100,
                req.body.data.metadata.walletId
              )
            : await this.withdrawUseCase.execute(
                req.body.data.amount / 100,
                req.body.data.metadata.walletId
              );

        return res.status(200).json({ status: true });
      }
      return res.status(200).json({ status: false });
    } catch (error) {
      next(error);
    }
  };
  fundWallet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.fundWalletUseCase.execute(
        req.body.amount,
        req["user"]
      );
      // const transaction = await this.createTransactionUseCase.execute({
      //   reciever: result,
      //   amount: req.body.amount,
      //   transactionType: TransactionType.DEPOSIT,
      //   paymentGateway: req.body.paymentGateway,
      //   currency: "NGN",
      // });
      return res.status(200).json(
        new ResponseData({
          status: true,
          data: result,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  getWalletByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const wallet = await this.getWalletByUserIdUseCase.execute(req["user"]);
      return res.status(200).json(
        new ResponseData({
          status: true,
          data: wallet,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  initiateFunding = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.initiateFundingUseCase.execute(
        req.body.amount,
        req["user"]
      );
      return res.status(200).json(
        new ResponseData({
          status: true,
          data: result,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  transfer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.getUserByIdUseCase.execute(req["user"]);
      const result = await this.transferUseCase.execute(
        req.body.amount,
        user,
        req.body.recieverAccountNo
      );
      return res.status(200).json(
        new ResponseData({
          status: true,
          data: result,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  withdraw = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.withdrawUseCase.execute(
        req.body.amount,
        req["user"]
      );
      return res.status(200).json(
        new ResponseData({
          status: true,
          data: result,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  getBanks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.getBanksUseCase.execute();
      return res.status(200).json(
        new ResponseData({
          status: true,
          data: result,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  verifyAccountNumber = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.verifyAccountNumberUseCase.execute(
        req.body.accountNumber,
        req.body.bankCode
      );
      return res.status(200).json(
        new ResponseData({
          status: true,
          data: result,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  initiateWithdrawal = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.initiateWithdrawalUseCase.execute(
        req.body.amount,
        req.body.accountName,
        req.body.accountNumber,
        req.body.bankCode,
        req["user"]
      );
      return res.status(200).json(
        new ResponseData({
          status: true,
          data: result,
        })
      );
    } catch (error) {
      next(error);
    }
  };
}
