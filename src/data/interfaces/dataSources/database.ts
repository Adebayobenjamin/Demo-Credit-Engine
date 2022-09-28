/**
 * Database Contract.
 *
 * This specifies what the database can do
 */
export interface IDatabase {
  insertOne<Type>(data: Type): Promise<Type>;
  find<Type>(query: {}): Promise<Type[]>;
  findOne<Type>(query: {}): Promise<Type | null>;
  findById<Type>(id: string): Promise<Type | null>;
  update<Type>(data: Type): Promise<Type | null>;
  // findOneWithRelations([])
}

/**
 * UserDatabase Contract.
 *
 * This specifies what the user database can do
 */
export interface IUserDatabase {
  insertOne<Type>(data: Type): Promise<Type>;
  findOne<Type>(query: {}): Promise<Type | null>;
  transaction(cb: (trx: any) => {}): Promise<any>;
}

/**
 * TransactionDatabase Contract.
 *
 * This specifies what the transaction database can do
 */
export interface ITransactionDatabase {
  insertOne<Type>(data: Type): Promise<Type>;
  findAllByRelations();
}

/**
 * WalletDatabase Contract.
 *
 * This specifies what the wallet database can do
 */
export interface IWalletDatabase {
  insertOne<Type>(data: Type): Promise<Type>;
  findOne<Type>(query: {}): Promise<Type | null>;
  findById<Type>(id: string): Promise<Type | null>;
  update<Type>(data: Type): Promise<Type | null>;
  transaction(cb: (trx: any) => {}): Promise<any>;
}
