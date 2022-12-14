import { IWalletDataSource } from "../../data/interfaces/dataSources/wallet.dataSource";
import { AccountVerificationResponse, Bank, IntailizatePaymentResponse, IPaymentGateway } from "../../data/interfaces/dataSources/paymentGateway/paymentGateway";
import { Wallet } from "../entities/wallet.entity";
import {
  IWalletRepository,
  WalletQuery,
} from "../interfaces/repositories/wallet.repository";

export class WalletRepository implements IWalletRepository {
  walletDataSource: IWalletDataSource;
  paymentGateway: IPaymentGateway;
  constructor(
    walletDataSource: IWalletDataSource,
    paymentGateway: IPaymentGateway
  ) {
    this.walletDataSource = walletDataSource;
    this.paymentGateway = paymentGateway;
  }

  createWallet(wallet: Wallet): Promise<Wallet> {
    return this.walletDataSource.create(wallet);
  }
  update(wallet: Wallet): Promise<Wallet| null> {
    return this.walletDataSource.update(wallet);
  }
  findBy(query: WalletQuery): Promise<Wallet | null> {
    return this.walletDataSource.findOne(query);
  }
  findById(id: string): Promise<Wallet| null> {
    return this.walletDataSource.findById(id);
  }
  findByUserId(userId: string): Promise<Wallet| null> {
    return this.walletDataSource.findByUserId(userId);
  }
  initiateFunding(
    amount: number,
    wallet: Wallet
  ): Promise<IntailizatePaymentResponse> {
    return this.paymentGateway.initiatePayment({ amount, wallet });
  }

  initaiteWithdrawal(amount: number, accountName: string, accountNumber: string, bankCode: string, walletId: string): Promise<boolean> {
   return this.paymentGateway.withdrawFromBankAccount(amount, accountName, accountNumber, bankCode, walletId)
  }
  getBanks(): Promise<Bank[]> {
    return this.paymentGateway.getBanks();
  }
  verifyAccountNumber(accountNumber: string, bankCode: string): Promise<AccountVerificationResponse> {
   return this.paymentGateway.verifyAccountNumber(accountNumber, bankCode)
  }
}
