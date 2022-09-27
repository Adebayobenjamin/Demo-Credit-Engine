import { User } from "../../../domain/entities/user.entity";

/**
 * Data Source Repository Contract.
 *
 * This specifies what the data source can do
 */
export interface IUserDataSource {
  findOne(query: {}): Promise<User | null>;
  create(data: User): Promise<User>;
}
