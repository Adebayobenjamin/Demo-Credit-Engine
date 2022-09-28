import {  } from "tsyringe";
import { Errors } from "../../../core/common/errors";
import { ResponseError } from "../../../core/common/Response";
import { Wallet } from "../../entities/wallet.entity";
import { IWalletRepository } from "../../interfaces/repositories/wallet.repository";
import { IInitiateWithdrawalUseCase } from "../../interfaces/useCases/wallet/initiateWithdrawal.useCase";


export class InitiateWithdrawalUseCase implements IInitiateWithdrawalUseCase {
  walletRepository: IWalletRepository;
  constructor(walletRepository: IWalletRepository) {
    this.walletRepository = walletRepository;
  }

  async execute(
    amount: number,
    accountName: string,
    accountNumber: string,
    bankCode: string,
    userId: string
  ): Promise<boolean> {
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet)
      throw new ResponseError({
        statusCode: 400,
        message: Errors.WALLET_NOT_FOUND,
      });
    return this.walletRepository.initaiteWithdrawal(
      amount,
      accountName,
      accountNumber,
      bankCode,
      wallet.id
    );
  }
}
