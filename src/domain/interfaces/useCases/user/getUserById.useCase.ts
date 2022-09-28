import { User } from "../../../entities/user.entity";
/**
 * User Registration UseCase Contract
 * 
 * this specifies what user register usecase can do
 */
export interface IGetUserByIdUseCase {
  execute(userId: string): Promise<User>;
}
