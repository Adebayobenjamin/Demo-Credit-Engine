
/**
 * Data Source Repository Contract.
 * 
 * This specifies what the data source can do
 */
export interface IDataSource {
  findOne<Type>(query: {}): Promise<Type>;
  findAll<Type>(query: {}): Promise<Type[]>;
  create<Type>(data: Type | {}): Promise<Type>;
  update(value: {}, query: {}): Promise<any>;
}
