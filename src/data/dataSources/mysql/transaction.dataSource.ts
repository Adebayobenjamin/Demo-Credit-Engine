import { autoInjectable } from "tsyringe";
import { Transaction } from "../../../domain/entities/transaction.entity";
import {
  IDatabase,
  ITransactionDatabase,
} from "../../interfaces/dataSources/database";
import { ITransactionDataSource } from "../../interfaces/dataSources/transaction.dataSource";

@autoInjectable()
export class TransactionDataSource implements ITransactionDataSource {
  database: ITransactionDatabase;
  constructor(database: ITransactionDatabase) {
    this.database = database;
  }
  findAllByUserId(userId: string): Promise<Transaction[]> {
    throw new Error("Method not implemented.");
  }
  create(data: Transaction): Promise<Transaction> {
    return this.database.insertOne(data);
  }
}
