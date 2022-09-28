import { IntailizatePaymentResponse } from "../../../data/interfaces/dataSources/paymentGateway/paymentGateway";
import { User } from "../../entities/user.entity";
import { Wallet } from "../../entities/wallet.entity";
/**
 * Wallet Repository Contract.
 *
 * This specifies what the wallet repository can do
 */
export interface IWalletRepository {
  createWallet(wallet: Wallet): Promise<Wallet>;
  update(wallet: Wallet): Promise<Wallet| null>;
  findBy(query: WalletQuery): Promise<Wallet | null>;
  findById(id: string):  Promise<Wallet | null>;
  findByUserId(userId: string): Promise<Wallet | null>;
  initiateFunding(
    amount: number,
    wallet: Wallet
  ): Promise<IntailizatePaymentResponse>;
}

export interface WalletQuery {
  id?: string;
  accountNo?: string;
  balance?: number;
  user?: User;
}

