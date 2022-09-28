import { IntailizatePaymentResponse } from "../../../../data/interfaces/dataSources/paymentGateway/paymentGateway";
import { Wallet } from "../../../entities/wallet.entity";
/***
 * Withdraw UseCase Contract
 * 
 * This specifies what the withdraw usecase can do
 */
export interface IInitiateFundingUseCase{
    execute(amount: number, userId: string): Promise<IntailizatePaymentResponse>
}
