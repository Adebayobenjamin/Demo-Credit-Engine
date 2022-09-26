import { Errors } from "../../../core/common/errors";
import { ResponseError } from "../../../core/common/Response";
import { Wallet } from "../../entities/wallet.entity";
import { IWalletRepository } from "../../interfaces/repositories/wallet.repository";
import { IWithdrawUsecase } from "../../interfaces/useCases/wallet/withdraw.useCase";

export class WithdrawUseCase implements IWithdrawUsecase {
    walletRepository: IWalletRepository;
    constructor(walletRepository: IWalletRepository) {
      this.walletRepository = walletRepository;
    }
  
    async execute(amount: number, userId: string): Promise<Wallet> {
      const userWallet = await this.walletRepository.findByUserId(userId);
      if (!userWallet)
        throw new ResponseError({
          statusCode: 400,
          message: Errors.WALLET_NOT_FOUND,
        });
  
      userWallet.balance -= amount;
      const update = await this.walletRepository.update(userWallet);
      if (!update)
        throw new ResponseError({
          statusCode: 400,
          message: Errors.SOMETHING_WENT_WRONG,
        });
  
      return userWallet;
    }
}
