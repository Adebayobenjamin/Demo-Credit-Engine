import { Wallet } from "../../../domain/entities/wallet.entity";

/**
 * Wallet Data Source Repository Contract.
 *
 * This specifies what the data source can do
 */
 export interface IWalletDataSource {
    findOne(query: {}): Promise<Wallet | null>;
    create(data: Wallet): Promise<Wallet>;
    update(data: Wallet): Promise<Wallet| null>;
    findById(id: string): Promise<Wallet| null>
    findByUserId(id: string): Promise<Wallet| null>
  }
  