import { Errors } from "../../../core/common/errors";
import { ResponseError } from "../../../core/common/Response";
import { Wallet } from "../../entities/wallet.entity";
import { IWalletRepository } from "../../interfaces/repositories/wallet.repository";
import { IWithdrawUseCase } from "../../interfaces/useCases/wallet/withdraw.useCase";

export class WithdrawUseCase implements IWithdrawUseCase {
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

    userWallet.balance -= amount / 100;
    const update = await this.walletRepository.update(userWallet);
    // TODO: Create Transaction
    if (!update)
      throw new ResponseError({
        statusCode: 400,
        message: Errors.SOMETHING_WENT_WRONG,
      });

    return userWallet;
  }
}
