import { User } from "../../entities/user.entity";
/**
 * User Repository Contract.
 * 
 * This specifies what the user repository can do
 */
export interface IUserRepository {
  register(user: User): Promise<User>;
  login(email: string, password: string): Promise<User>;
  findBy(query: {}): Promise<User>;
  isExistingEmail(email: string): Promise<boolean>;
}
