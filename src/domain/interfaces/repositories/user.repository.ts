import { User } from "../../entities/user.entity";
/**
 * User Repository Contract.
 *
 * This specifies what the user repository can do
 */
export interface IUserRepository {
  create(user: User): Promise<User>;
  login(email: string, password: string): Promise<User | null>;
  findBy(query: {}): Promise<User | null>;
  isExistingEmail(email: string): Promise<boolean>;
}
