import { Wallet } from "../../../entities/wallet.entity";
/***
 * GetWalletByUserId UseCase Contract
 * 
 * This specifies what the getWalletByUserId usecase can do
 */
export interface IGetWalletByUserIdUseCase {
  execute(userId: string): Promise<Wallet>;
}
