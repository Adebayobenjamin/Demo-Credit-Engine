import { Wallet } from "../../../entities/wallet.entity";
/***
 * InitaiteWithdrawal UseCase Contract
 * 
 * This specifies what the withdraw usecase can do
 */
export interface IInitiateWithdrawalUseCase{
    execute(amount: number, userId: string): Promise<Wallet>
}