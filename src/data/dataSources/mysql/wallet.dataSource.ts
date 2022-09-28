import { Wallet } from "../../../domain/entities/wallet.entity";
import { IWalletDatabase } from "../../interfaces/dataSources/database";
import { IWalletDataSource } from "../../interfaces/dataSources/wallet.dataSource";


export class WalletDataSource implements IWalletDataSource {
  database: IWalletDatabase;
  constructor(
    database?: IWalletDatabase) {
    this.database = database;
  }

  findOne(query: {}): Promise<Wallet> {
    return this.database.findOne(query);
  }
  create(data: Wallet): Promise<Wallet> {
    return this.database.insertOne(data);
  }
  update(data: Wallet): Promise<Wallet> {
    return this.database.update(data);
  }
  findById(id: string): Promise<Wallet> {
    return this.database.findById(id);
  }
  findByUserId(id: string): Promise<Wallet> {
    return this.database.findOne({ userId: id });
  }
}
