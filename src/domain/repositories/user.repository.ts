import { autoInjectable } from "tsyringe";
import { CryptBox } from "../../core/utils/cryptBox";
import { IUserDataSource } from "../../data/interfaces/dataSources/user.dataSource";
import { User } from "../entities/user.entity";
import { IUserRepository } from "../interfaces/repositories/user.repository";

@autoInjectable()
export class UserRepository implements IUserRepository {
  userDataSource: IUserDataSource;
  cryptBox: CryptBox;
  constructor(userDataSource: IUserDataSource, cryptBox: CryptBox) {
    this.userDataSource = userDataSource;
    this.cryptBox = cryptBox;
  }
  async create(user: User): Promise<User> {
    user.password = await this.cryptBox.hashString(user.password);
    return this.userDataSource.create(user);
  }
  async login(email: string, password: string): Promise<User | null> {
    const user = await this.userDataSource.findOne({ email });
    if (!user) return null;
    const isSamePassword = await this.cryptBox.verifyHash(
      user.password,
      password
    );
    if (!isSamePassword) return null;
    return user;
  }
  findBy(query: {}): Promise<User> {
    return this.userDataSource.findOne(query);
  }
  async isExistingEmail(email: string): Promise<boolean> {
    return (await this.userDataSource.findOne({ email })) != null;
  }
}
