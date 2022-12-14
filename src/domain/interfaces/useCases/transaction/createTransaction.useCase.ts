import { Transaction } from "../../../entities/transaction.entity";

/***
 * CreateTransaction UseCase Contract
 * 
 * This specifies what the createTransaction usecase can do
 */
export interface ICreateTransactionUseCase {
  execute(transaction: Transaction): Promise<Transaction>;
}
