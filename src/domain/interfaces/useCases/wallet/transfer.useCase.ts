import { Wallet } from "../../../entities/wallet.entity";

/***
 * Transfer UseCase Contract
 * 
 * This specifies what the Transfer usecase can do
 */
export interface ITransferUsecase{
    execute(amount: number, senderWallet: Wallet, recieverWallet: Wallet): Promise<boolean>
}