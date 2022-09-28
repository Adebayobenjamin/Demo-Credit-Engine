import { Errors } from "../../../core/common/errors";
import { ResponseError } from "../../../core/common/Response";
import { Wallet } from "../../entities/wallet.entity";
import { IWalletRepository } from "../../interfaces/repositories/wallet.repository";
import { IFundWalletUseCase } from "../../interfaces/useCases/wallet/fundWallet.useCase";

export class FundWalletUseCase implements IFundWalletUseCase {
  walletRepository: IWalletRepository;
  constructor(walletRepository: IWalletRepository) {
    this.walletRepository = walletRepository;
  }

  async execute(amount: number, walletId: string): Promise<Wallet> {
    const userWallet = await this.walletRepository.findById(walletId);
    if (!userWallet)
      throw new ResponseError({
        statusCode: 400,
        message: Errors.WALLET_NOT_FOUND,
      });
    delete userWallet["createdAt"];
    delete userWallet["updatedtAt"];
    delete userWallet["deletedtAt"];
    delete userWallet["userId"]
    userWallet.balance += amount * 1.0;
    console.log("amount", amount, userWallet);
    const update = await this.walletRepository.update(userWallet);
    console.log(update, "update")
    if (!update)
      throw new ResponseError({
        statusCode: 400,
        message: Errors.SOMETHING_WENT_WRONG,
      });

    return userWallet;
  }
}
