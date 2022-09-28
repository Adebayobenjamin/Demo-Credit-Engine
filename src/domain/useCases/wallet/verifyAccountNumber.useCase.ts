import { AccountVerificationResponse } from "../../../data/interfaces/dataSources/paymentGateway/paymentGateway";
import { IWalletRepository } from "../../interfaces/repositories/wallet.repository";
import { IVerifyAccountNumberUseCase } from "../../interfaces/useCases/wallet/verifyAccountNumber.useCase";

export class VerifyAccountNumberUseCase implements IVerifyAccountNumberUseCase {
  walletRepository: IWalletRepository;
  constructor(walletRepository: IWalletRepository) {
    this.walletRepository = walletRepository;
  }
  execute(
    accountNumber: string,
    bankCode: string
  ): Promise<AccountVerificationResponse> {
    return this.walletRepository.verifyAccountNumber(accountNumber, bankCode);
  }
}
