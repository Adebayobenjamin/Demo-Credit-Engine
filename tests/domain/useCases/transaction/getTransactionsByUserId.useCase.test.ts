import {
  Transaction,
  TransactionType,
} from "../../../../src/domain/entities/transaction.entity";
import { User } from "../../../../src/domain/entities/user.entity";
import { ITransactionRepository } from "../../../../src/domain/interfaces/repositories/transaction.repository";
import { IGetTransactionsByUserIdUseCase } from "../../../../src/domain/interfaces/useCases/transaction/getTransactionsByUserId.useCase";
import { GetTransactionsByUserIdUseCase } from "../../../../src/domain/useCases/transaction/getTransactionsByUserId.useCase";
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
  let getTransactionsByUserIdUsecase: IGetTransactionsByUserIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    mockTransactionRepository = new MockTransactionRepository();
    getTransactionsByUserIdUsecase = new GetTransactionsByUserIdUseCase(
      mockTransactionRepository
    );
  });

  let tUser = {
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
  const tTransactions: Transaction[] = [
    {
      id: uuid.v4(),
      reference_code: "xdee7054",
      ...tPayload,
    },
  ];
  test("should return all user transactions", async () => {
    // arrange
    jest
      .spyOn(mockTransactionRepository, "findAllByUserId")
      .mockImplementation(() => Promise.resolve(tTransactions));
    // act
    const result = await getTransactionsByUserIdUsecase.execute(tUser.id);
    // assert
    expect(result).toBeDefined();
    expect(result).toStrictEqual(tTransactions);
    expect(mockTransactionRepository.findAllByUserId).toBeCalledTimes(1);
  });

  test("should return empty array for no transactions", async () => {
    // arrange
    jest
      .spyOn(mockTransactionRepository, "findAllByUserId")
      .mockImplementation(() => Promise.resolve([]));
    // act
    const result = await getTransactionsByUserIdUsecase.execute(tUser.id);
    // assert
    expect(result).toBeDefined();
    expect(result).toStrictEqual([]);
    expect(mockTransactionRepository.findAllByUserId).toBeCalledTimes(1);
  });
});
