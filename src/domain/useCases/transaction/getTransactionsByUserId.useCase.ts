import { autoInjectable } from "tsyringe";
import { Transaction } from "../../entities/transaction.entity";
import { ITransactionRepository } from "../../interfaces/repositories/transaction.repository";
import { IGetTransactionsByUserIdUseCase } from "../../interfaces/useCases/transaction/getTransactionsByUserId.useCase";

@autoInjectable()
export class GetTransactionsByUserIdUseCase
  implements IGetTransactionsByUserIdUseCase
{
  transactionRepository: ITransactionRepository;
  constructor(transactionRepository: ITransactionRepository) {
    this.transactionRepository = transactionRepository;
  }
  execute(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.findAllByUserId(userId);
  }
}
