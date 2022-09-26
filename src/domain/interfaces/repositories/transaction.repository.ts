import { Transaction } from "../../entities/transaction.entity";

/**
 * Transaction Repository Contract.
 * 
 * This specifies what the transaction repository can do
 */
export interface ITransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;
  findAllByUserId(userId: string): Promise<Transaction[]>;
}
