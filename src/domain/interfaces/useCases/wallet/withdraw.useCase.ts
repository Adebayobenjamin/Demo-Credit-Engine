import { Wallet } from "../../../entities/wallet.entity";
/***
 * Withdraw UseCase Contract
 *
 * This specifies what the withdraw usecase can do
 */
export interface IWithdrawUseCase {
  execute(amount: number, walletId: string): Promise<Wallet>;
}
