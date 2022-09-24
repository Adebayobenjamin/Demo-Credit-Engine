import { Transaction } from "../../entities/transaction.entity";

/**
 * Transaction Repository Contract.
 * 
 * This specifies what the transaction repository can do
 */
export interface ITransaction {
  save(transaction: Transaction): Promise<Transaction>;
  getByUserId(userId: string): Promise<Transaction>;
}
