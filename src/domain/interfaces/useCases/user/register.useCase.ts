import { User } from "../../../entities/user.entity";
/**
 * User Registration Usecase Contract
 * 
 * this specifies what user register usecase can do
 */
export interface IRegisterUsecase {
  execute(user: User): Promise<User>;
}
