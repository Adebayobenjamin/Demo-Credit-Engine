import { User } from "./user.entity";
import { Wallet } from "./wallet.entity";

export interface Transaction {
  id?: string;
  amount: number;
  transactionType: string;
  sender?: User;
  reciever: User;
  paymentGateway: string;
  currency: string;
  wallet: Wallet;
  reference_code?: string;
}

export enum TransactionType {
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdrawal",
  TRANSFER = "transfer",
}
