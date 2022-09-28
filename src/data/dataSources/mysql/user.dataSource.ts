import { autoInjectable } from "tsyringe";
import { User } from "../../../domain/entities/user.entity";
import { IUserDatabase } from "../../interfaces/dataSources/database";
import { IUserDataSource } from "../../interfaces/dataSources/user.dataSource";

@autoInjectable()
export class UserDataSource implements IUserDataSource {
  database: IUserDatabase;
  constructor(Database: IUserDatabase) {
    this.database = Database;
  }

  findOne(query: {}): Promise<User> {
    return this.database.findOne(query);
  }
  create(data: User): Promise<User> {
    return this.database.insertOne(data);
  }
}
