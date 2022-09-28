import { User } from "./user.entity";
import { Wallet } from "./wallet.entity";

export interface Transaction {
  id?: string;
  amount: number;
  transactionType: string;
  sender?: string;
  reciever: string;
  paymentGateway: string;
  currency: string;
  reference_code?: string;
}

export enum TransactionType {
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdrawal",
  TRANSFER = "transfer",
}
