import { Wallet } from "../../../entities/wallet.entity";

/***
 * CreateWallet UseCase Contract
 * 
 * This specifies what the CreateWallet usecase can do
 */
export interface ICreateWalletUseCase {
  execute(wallet: Wallet): Promise<Wallet>;
}
