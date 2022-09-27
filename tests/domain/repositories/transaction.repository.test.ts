import { ITransactionDataSource } from "../../../src/data/interfaces/dataSources/transaction.dataSource";
import {
  Transaction,
  TransactionType,
} from "../../../src/domain/entities/transaction.entity";
import { User } from "../../../src/domain/entities/user.entity";
import { Wallet } from "../../../src/domain/entities/wallet.entity";
import { ITransactionRepository } from "../../../src/domain/interfaces/repositories/transaction.repository";
import { TransactionRepository } from "../../../src/domain/repositories/transaction.repository";
import { Chance } from "chance";
const chance = new Chance();
import * as uuid from "uuid";
describe("Transaction Repository", () => {
  class MockTransactionDataSource implements ITransactionDataSource {
    findOne(query: {}): Promise<Transaction | null> {
      throw new Error("Method not implemented.");
    }
    findAll(query: {}): Promise<Transaction[]> {
      throw new Error("Method not implemented.");
    }
    create(data: Transaction): Promise <Transaction>{
      throw new Error("Method not implemented.");
    }
    update(data: Transaction): Promise<Transaction> {
      throw new Error("Method not implemented.");
    }
  }

  let mockTransactionDataSource: MockTransactionDataSource;
  let transactionRepository: ITransactionRepository;
  beforeEach(() => {
    jest.clearAllMocks();
    mockTransactionDataSource = new MockTransactionDataSource();
    transactionRepository = new TransactionRepository(mockTransactionDataSource);
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
  describe("Create", () => {
    test("should create transaction", async () => {
      // arrange
      jest
        .spyOn(mockTransactionDataSource, "create")
        .mockImplementation(() => Promise.resolve(tTransaction));
      // act
      const result = await transactionRepository.create(tPayload);
      //assert
      expect(result).toBeDefined();
      expect(result).toStrictEqual(tTransaction);
      expect(mockTransactionDataSource.create).toBeCalledTimes(1);
    });
  });
  describe("FindByUserId", () => {
    test("should find all transactions by userId", async () => {
      // arrange
      let tUserId = uuid.v4()
      jest
        .spyOn(mockTransactionDataSource, "findAll")
        .mockImplementation(() => Promise.resolve([tTransaction]));
      // act
      const result = await transactionRepository.findAllByUserId(tUserId);
      //assert
      expect(result).toBeDefined();
      expect(result).toStrictEqual([tTransaction]);
      expect(mockTransactionDataSource.findAll).toBeCalledTimes(1);
    });
  });
});
