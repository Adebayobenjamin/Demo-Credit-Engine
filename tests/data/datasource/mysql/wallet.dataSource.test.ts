import {
  IDatabase,
  IWalletDatabase,
} from "../../../../src/data/interfaces/dataSources/database";
import { IWalletDataSource } from "../../../../src/data/interfaces/dataSources/wallet.dataSource";
import { WalletDataSource } from "../../../../src/data/dataSources/mysql/wallet.dataSource";
import { Chance } from "chance";
const chance = new Chance();
import * as uuid from "uuid";
import { User } from "../../../../src/domain/entities/user.entity";
import { Wallet } from "../../../../src/domain/entities/wallet.entity";
describe("Wallet DataSource", () => {
  let mockDatabase: IWalletDatabase;
  let walletDataSource: IWalletDataSource;

  beforeAll(() => {
    mockDatabase = {
      findOne: jest.fn(),
      insertOne: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      transaction: jest.fn(),
    };
    walletDataSource = new WalletDataSource(mockDatabase);
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let tUser: User = {
    id: uuid.v4(),
    email: chance.email(),
    password: chance.sentence(),
  };
  const tInputData = {
    accountNo: "000000000",
    userId: tUser.id as string,
  };
  const tWallet: Wallet = {
    id: uuid.v4(),
    balance: 0.0,
    ...tInputData,
  };

  describe("findOne", () => {
    test("should return wallet", async () => {
      // arrange
      jest
        .spyOn(mockDatabase, "findOne")
        .mockImplementation(() => Promise.resolve(tWallet));
      // act
      const result = await walletDataSource.findOne(tInputData);
      // assert
      expect(result).toBeDefined();
      expect(result).toStrictEqual(tWallet);
      expect(mockDatabase.findOne).toBeCalledWith(tInputData);
      expect(mockDatabase.findOne).toBeCalledTimes(1);
    });

    test("should return null if wallet does not exist", async () => {
      // arrange
      jest
        .spyOn(mockDatabase, "findOne")
        .mockImplementation(() => Promise.resolve(null));
      // act
      const result = await walletDataSource.findOne(tInputData);
      // assert
      expect(result).toBeNull();
      expect(mockDatabase.findOne).toBeCalledWith(tInputData);
      expect(mockDatabase.findOne).toBeCalledTimes(1);
    });
  });
  //   creae
  describe("Create", () => {
    test("should create and return wallet", async () => {
      // arrange
      jest
        .spyOn(mockDatabase, "insertOne")
        .mockImplementation(() => Promise.resolve(tWallet));
      // act
      const result = await walletDataSource.create(tInputData);
      // assert
      expect(result).toBeDefined();
      expect(result).toStrictEqual(tWallet);
      expect(mockDatabase.insertOne).toBeCalledWith(tInputData);
      expect(mockDatabase.insertOne).toBeCalledTimes(1);
    });
  });
  // update
  describe("Update", () => {
    test("should return wallet", async () => {
      // arrange
      jest
        .spyOn(mockDatabase, "update")
        .mockImplementation(() => Promise.resolve(tWallet));
      // act
      const result = await walletDataSource.update(tInputData);
      // assert
      expect(result).toBeDefined();
      expect(result).toStrictEqual(tWallet);
      expect(mockDatabase.update).toBeCalledWith(tInputData);
      expect(mockDatabase.update).toBeCalledTimes(1);
    });

    test("should return null if wallet does not exist", async () => {
      // arrange
      jest
        .spyOn(mockDatabase, "update")
        .mockImplementation(() => Promise.resolve(null));
      // act
      const result = await walletDataSource.update(tInputData);
      // assert
      expect(result).toBeNull();
      expect(mockDatabase.update).toBeCalledWith(tInputData);
      expect(mockDatabase.update).toBeCalledTimes(1);
    });
  });
  // findById
  describe("FindById", () => {
    test("should return wallet", async () => {
      // arrange
      jest
        .spyOn(mockDatabase, "findById")
        .mockImplementation(() => Promise.resolve(tWallet));
      // act
      const result = await walletDataSource.findById(tWallet.id as string);
      // assert
      expect(result).toBeDefined();
      expect(result).toStrictEqual(tWallet);
      expect(mockDatabase.findById).toBeCalledWith(tWallet.id);
      expect(mockDatabase.findById).toBeCalledTimes(1);
    });

    test("should return null if wallet does not exist", async () => {
      // arrange
      jest
        .spyOn(mockDatabase, "findById")
        .mockImplementation(() => Promise.resolve(null));
      // act
      const result = await walletDataSource.findById(tWallet.id as string);
      // assert
      expect(result).toBeNull();
      expect(mockDatabase.findById).toBeCalledWith(tWallet.id);
      expect(mockDatabase.findById).toBeCalledTimes(1);
    });
  });
  // findByUser
});
