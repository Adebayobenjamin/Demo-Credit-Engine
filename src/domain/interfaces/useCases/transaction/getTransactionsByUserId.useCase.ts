import { Transaction } from "../../../entities/transaction.entity";

export interface getTransactionsByUserIdUsecase{
    execute(userId: string): Promise<Transaction[]>
}