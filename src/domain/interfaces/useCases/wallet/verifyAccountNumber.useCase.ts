import { AccountVerificationResponse } from "../../../../data/interfaces/dataSources/paymentGateway/paymentGateway";
import { Wallet } from "../../../entities/wallet.entity";
/***
 * GetWalletByUserId UseCase Contract
 * 
 * This specifies what the getWalletByUserId usecase can do
 */
export interface IVerifyAccountNumberUseCase {
  execute(accountNumber: string, bankCode: string): Promise<AccountVerificationResponse>;
}
