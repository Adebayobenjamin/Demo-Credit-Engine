import {
  Transaction,
  TransactionType,
} from "../../../../src/domain/entities/transaction.entity";
import { User } from "../../../../src/domain/entities/user.entity";
import { ITransactionRepository } from "../../../../src/domain/interfaces/repositories/transaction.repository";
import { ICreateTransactionUseCase } from "../../../../src/domain/interfaces/useCases/transaction/createTransaction.useCase";
import { CreateTransactionUseCase } from "../../../../src/domain/useCases/transaction/createTransaction.useCase";
import * as uuid from "uuid";
import { Chance } from "chance";
import { Errors } from "../../../../src/core/common/errors";
import { Wallet } from "../../../../src/domain/entities/wallet.entity";
const chance = new Chance();
describe("Create Transaction UseCase", () => {
  class MockTransactionRepository implements ITransactionRepository {
    create(transaction: Transaction): Promise<Transaction> {
      throw new Error("Method not implemented.");
    }
    findAllByUserId(userId: string): Promise<Transaction[]> {
      throw new Error("Method not implemented.");
    }
  }

  let mockTransactionRepository: ITransactionRepository;
  let createTransactionUseCase: ICreateTransactionUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    mockTransactionRepository = new MockTransactionRepository();
    createTransactionUseCase = new CreateTransactionUseCase(
      mockTransactionRepository
    );
  });

  let tUser: User = {
    id: uuid.v4(),
    email: chance.email(),
    password: chance.sentence(),
  };

  const tUserWallet: Wallet = {
    id: uuid.v4(),
    accountNo: "000000000",
    balance: 1000,
    user: tUser,
  };
  const tPayload: Transaction = {
    amount: chance.natural(),
    transactionType: TransactionType.DEPOSIT,
    reciever: tUser,
    paymentGateway: "paystack",
    currency: "NGN",
    wallet: tUserWallet,
  };
  const tTransaction: Transaction = {
    id: uuid.v4(),
    reference_code: "xdee7054",
    ...tPayload,
  };
  test("should Create Transaction", async () => {
    // arrange
    jest
      .spyOn(mockTransactionRepository, "create")
      .mockImplementation(() => Promise.resolve(tTransaction));
    // act
    const result = await createTransactionUseCase.execute(tPayload);
    // assert
    expect(result).toBeDefined();
    expect(result).toStrictEqual(tTransaction);
    expect(mockTransactionRepository.create).toBeCalledTimes(1);
  });
});
