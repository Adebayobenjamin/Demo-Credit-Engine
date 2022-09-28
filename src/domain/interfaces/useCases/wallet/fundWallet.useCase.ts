import { Wallet } from "../../../entities/wallet.entity";

/***
 * FundWallet UseCase Contract
 * 
 * This specifies what the FundWallet usecase can do
 */
export interface IFundWalletUseCase {
  execute(amount: number, userId: string): Promise<Wallet>;
}
