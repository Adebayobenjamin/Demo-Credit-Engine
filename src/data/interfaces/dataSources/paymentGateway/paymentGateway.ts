import { Wallet } from "../../../../domain/entities/wallet.entity";

/**
 * Payment GatewayContract.
 *
 * This specifies what the payment gateway can do
 */
export interface IPaymentGateway {
  initiatePayment(payload: InitiatePaymentPayload): Promise<any>;
  withdrawFromBankAccount(payload: any): Promise<any>;
  verifyTransaction(payload: any): Promise<any>;
}

export interface InitiatePaymentPayload {
  amount: number;
  wallet: Wallet;
}

export interface IntailizatePaymentResponse {
  status: boolean;
  paymentUrl: string;
  paymentCode?: string;
  reference: string;
}
