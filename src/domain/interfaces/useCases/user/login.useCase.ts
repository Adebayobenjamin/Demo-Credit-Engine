import { User } from "../../../entities/user.entity";
/***
 * Login UseCase Contract
 * 
 * This specifies what the login usecase can do
 */
export interface ILoginUsecase{
    execute(email: string, password: string):Promise<User>
}
