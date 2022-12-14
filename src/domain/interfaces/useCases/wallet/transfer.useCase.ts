import { User } from "../../../entities/user.entity";

/***
 * Transfer UseCase Contract
 * 
 * This specifies what the Transfer usecase can do
 */
export interface ITransferUseCase{
    execute(amount: number, sender: User, recieverAccountNo: string): Promise<boolean>
}