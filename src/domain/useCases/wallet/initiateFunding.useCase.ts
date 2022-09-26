import { Errors } from "../../../core/common/errors";
import { ResponseError } from "../../../core/common/Response";
import { Wallet } from "../../entities/wallet.entity";
import { IWalletRepository } from "../../interfaces/repositories/wallet.repository";
import {
  IInitiateFundingUsecase,
  PaymentIntailizationResponse,
} from "../../interfaces/useCases/wallet/initiateFunding.useCase";

export class InitiateFundingUseCase implements IInitiateFundingUsecase {
  walletRepository: IWalletRepository;
  constructor(walletRepository: IWalletRepository) {
    this.walletRepository = walletRepository;
  }

  async execute(
    amount: number,
    userId: string
  ): Promise<PaymentIntailizationResponse> {
    const userWallet = await this.walletRepository.findByUserId(userId);
    if (!userWallet)
      throw new ResponseError({
        statusCode: 400,
        message: Errors.WALLET_NOT_FOUND,
      });
    return this.walletRepository.initiateFunding(amount, userWallet);
  }
}
