import { autoInjectable } from "tsyringe";
import { Errors } from "../../../core/common/errors";
import { ResponseError } from "../../../core/common/Response";
import { IntailizatePaymentResponse } from "../../../data/interfaces/dataSources/paymentGateway/paymentGateway";
import { Wallet } from "../../entities/wallet.entity";
import { IWalletRepository } from "../../interfaces/repositories/wallet.repository";
import {
  IInitiateFundingUseCase,
} from "../../interfaces/useCases/wallet/initiateFunding.useCase";

@autoInjectable()
export class InitiateFundingUseCase implements IInitiateFundingUseCase {
  walletRepository: IWalletRepository;
  constructor(walletRepository: IWalletRepository) {
    this.walletRepository = walletRepository;
  }

  async execute(
    amount: number,
    userId: string
  ): Promise<IntailizatePaymentResponse> {
    const userWallet = await this.walletRepository.findByUserId(userId);
    if (!userWallet)
      throw new ResponseError({
        statusCode: 400,
        message: Errors.WALLET_NOT_FOUND,
      });
    return this.walletRepository.initiateFunding(amount, userWallet);
  }
}
