/**
 * Payment GatewayContract.
 *
 * This specifies what the payment gateway can do
 */
export interface IPaymentGateway {
  initiatePayment(payload: any): Promise<any>;
  withdrawFromBankAccount(payload: any): Promise<any>
  verifyTransaction(payload: any): Promise<any>
}
