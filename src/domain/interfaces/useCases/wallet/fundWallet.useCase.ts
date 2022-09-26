import { Wallet } from "../../../entities/wallet.entity";

/***
 * FundWallet UseCase Contract
 * 
 * This specifies what the FundWallet usecase can do
 */
export interface IFundWalletUsecase {
  execute(amount: number, userId: string): Promise<Wallet>;
}
