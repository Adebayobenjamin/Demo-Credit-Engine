import {
  IDatabase,
  ITransactionDatabase,
} from "../../../../src/data/interfaces/dataSources/database";
import { ITransactionDataSource } from "../../../../src/data/interfaces/dataSources/transaction.dataSource";
import { TransactionDataSource } from "../../../../src/data/dataSources/mysql/transaction.dataSource";
import { Chance } from "chance";
const chance = new Chance();
import * as uuid from "uuid";
import {
  Transaction,
  TransactionType,
} from "../../../../src/domain/entities/transaction.entity";
import { User } from "../../../../src/domain/entities/user.entity";
import { Wallet } from "../../../../src/domain/entities/wallet.entity";
describe("Transaction DataSource", () => {
  let mockDatabase: ITransactionDatabase;
  let transactionDataSource: ITransactionDataSource;
  beforeAll(() => {
    mockDatabase = {
      insertOne: jest.fn(),
      findAllByRelations: jest.fn(),
    };
    transactionDataSource = new TransactionDataSource(mockDatabase);
  });

  beforeEach(() => {
    jest.clearAllMocks();
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
    userId: tUser.id as string,
  };
  const tPayload: Transaction = {
    amount: chance.natural(),
    transactionType: TransactionType.DEPOSIT,
    reciever: tUserWallet.id as string,
    paymentGateway: "paystack",
    currency: "NGN",
  };
  const tTransaction: Transaction = {
    id: uuid.v4(),
    reference_code: "xdee7054",
    ...tPayload,
  };
  describe("FindAllByUserId", () => {});

  describe("Create", () => {
    test("should create and return transaction", async () => {
      // arrange
      jest
        .spyOn(mockDatabase, "insertOne")
        .mockImplementation(() => Promise.resolve(tTransaction));
      // act
      const result = await transactionDataSource.create(tPayload);
      // assert
      expect(result).toBeDefined();
      expect(result).toStrictEqual(tTransaction);
      expect(mockDatabase.insertOne).toBeCalledWith(tPayload);
    });
  });
});
