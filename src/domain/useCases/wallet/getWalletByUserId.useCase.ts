import { autoInjectable } from "tsyringe";
import { Errors } from "../../../core/common/errors";
import { ResponseError } from "../../../core/common/Response";
import { Wallet } from "../../entities/wallet.entity";
import { IWalletRepository } from "../../interfaces/repositories/wallet.repository";
import { IGetWalletByUserIdUseCase } from "../../interfaces/useCases/wallet/getWalletByUserId.useCase";

@autoInjectable()
export class GetWalletByUserIdUseCase implements IGetWalletByUserIdUseCase {
  walletRepository: IWalletRepository;
  constructor(walletRepository: IWalletRepository) {
    this.walletRepository = walletRepository;
  }
  async execute(userId: string): Promise<Wallet> {
    const userWallet = await this.walletRepository.findByUserId(userId);
    if (!userWallet)
      throw new ResponseError({
        statusCode: 400,
        message: Errors.WALLET_NOT_FOUND,
      });
    return userWallet;
  }
}
