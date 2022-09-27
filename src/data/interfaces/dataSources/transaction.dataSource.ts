import { Transaction } from "../../../domain/entities/transaction.entity";

/**
 * Transaction Data Source Repository Contract.
 *
 * This specifies what the data source can do
 */
 export interface ITransactionDataSource {
    findOne(query: {}): Promise<Transaction | null>;
    findAll(query: {}): Promise<Transaction[]>;
    create(data: Transaction): Promise<Transaction>;
    update(data: Transaction): Promise<Transaction>;
  }
  