import { Transaction } from "../../entities/transaction.entity";
import { ITransactionRepository } from "../../interfaces/repositories/transaction.repository";
import { ICreateTransactionUseCase } from "../../interfaces/useCases/transaction/createTransaction.useCase";

export class CreateTransactionUseCase implements ICreateTransactionUseCase {
  transactionRepository: ITransactionRepository;
  constructor(transactionRepository: ITransactionRepository) {
    this.transactionRepository = transactionRepository;
  }
  #generateReferenceCode(): string {
    const alph = "qwertyuiopasdfghjklzxcvbnmmnbvcxzlkjhgfdsapoiuytrewqestfudsk";
    let code = "";
    for (let i = 0; i < 6; i++) {
      const index = Math.floor(Math.random() * alph.length);
      code += alph[index];
    }
    return code;
  }
  execute(transaction: Transaction): Promise<Transaction> {
    transaction.reference_code = this.#generateReferenceCode();
    return this.transactionRepository.create(transaction);
  }
}
