
/**
 * Database Contract.
 * 
 * This specifies what the database can do
 */
export interface IDatabase {
  insertOne<Type>(data: any): Promise<Type>;
  find<Type>(query: {}): Promise<Type>;
  findOne<Type>(query: {}): Promise<Type>;
  update<Type>(value: {}, query: {}): Promise<Type>;
}
