import { Transaction } from "../../../entities/transaction.entity";

export interface IGetTransactionsByUserIdUseCase{
    execute(userId: string): Promise<Transaction[]>
}