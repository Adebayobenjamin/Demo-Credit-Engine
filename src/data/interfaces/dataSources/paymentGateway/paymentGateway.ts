import { Wallet } from "../../../../domain/entities/wallet.entity";

/**
 * Payment GatewayContract.
 *
 * This specifies what the payment gateway can do
 */
export interface IPaymentGateway {
  initiatePayment(payload: InitiatePaymentPayload): Promise<any>;
  withdrawFromBankAccount(amount: number, accountName: string, accountNumber: string, bankCode: string, walletId: string): Promise<any>;
  verifyTransaction(payload: any): Promise<any>;
  verifyAccountNumber(
    accountNumber: string,
    bankCode: string
  ): Promise<AccountVerificationResponse>;
  getBanks(): Promise<Bank[]>;
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

export interface AccountVerificationResponse {
  status: boolean;
  accountName: string;
  accountNumber: string;
}

export interface Bank {
  name: string;
  code: string;
}
