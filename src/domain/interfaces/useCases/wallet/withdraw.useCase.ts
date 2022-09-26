import { Wallet } from "../../../entities/wallet.entity";
/***
 * Withdraw UseCase Contract
 * 
 * This specifies what the withdraw usecase can do
 */
export interface IWithdrawUsecase{
    execute(amount: number, userId: string): Promise<Wallet>
}