import {  } from "tsyringe";
import { ITransactionDataSource } from "../../data/interfaces/dataSources/transaction.dataSource";
import { Transaction } from "../entities/transaction.entity";
import { ITransactionRepository } from "../interfaces/repositories/transaction.repository";

export class TransactionRepository implements ITransactionRepository {
  transactionDataSource: ITransactionDataSource;
  constructor(dataSoure: ITransactionDataSource) {
    this.transactionDataSource = dataSoure;
  }

  create(transaction: Transaction): Promise<Transaction> {
    return this.transactionDataSource.create(transaction);
  }
  findAllByUserId(userId: string): Promise<Transaction[]> {
    return this.transactionDataSource.findAllByUserId(userId);
  }
}
