import { Wallet } from "../../../entities/wallet.entity";
/***
 * Withdraw UseCase Contract
 * 
 * This specifies what the withdraw usecase can do
 */
export interface IInitiateFundingUsecase{
    execute(amount: number, userId: string): Promise<PaymentIntailizationResponse>
}

export interface PaymentIntailizationResponse {
    status: boolean;
    paymentUrl: string;
    paymentCode?: string;
    reference: string;
  }