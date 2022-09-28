import {
  IDatabase,
  IUserDatabase,
} from "../../../../src/data/interfaces/dataSources/database";
import { IUserDataSource } from "../../../../src/data/interfaces/dataSources/user.dataSource";
import { UserDataSource } from "../../../../src/data/dataSources/mysql/user.dataSource";
import { User } from "../../../../src/domain/entities/user.entity";
import { Chance } from "chance";
const chance = new Chance();
import * as uuid from "uuid";
describe("User DataSource", () => {
  let mockDatabase: IUserDatabase;
  let userDataSource: IUserDataSource;

  beforeAll(() => {
    mockDatabase = {
      findOne: jest.fn(),
      insertOne: jest.fn(),
      transaction: jest.fn()
    };
    userDataSource = new UserDataSource(mockDatabase);
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const inputData = {
    email: chance.email(),
    password: chance.sentence(),
  };
  const tUser: User = {
    ...inputData,
    id: uuid.v4(),
  };
  describe("FindOne", () => {
    test("should find user", async () => {
      // arrange
      jest
        .spyOn(mockDatabase, "findOne")
        .mockImplementation(() => Promise.resolve(tUser));
      // act
      const result = await userDataSource.findOne({ email: tUser.email });
      // assert
      expect(result).toBeDefined();
      expect(result).toStrictEqual(tUser);
      expect(mockDatabase.findOne).toHaveBeenCalledWith({ email: tUser.email });
      expect(mockDatabase.findOne).toHaveBeenCalledTimes(1);
    });
    test("should return null if user does not exist", async () => {
      // arrange
      jest
        .spyOn(mockDatabase, "findOne")
        .mockImplementation(() => Promise.resolve(null));
      // act
      const result = await userDataSource.findOne({ email: tUser.email });
      // assert
      expect(result).toBeNull();
      expect(mockDatabase.findOne).toHaveBeenCalledWith({ email: tUser.email });
      expect(mockDatabase.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe("Create", () => {
    test("should create and return user", async () => {
      // arrange
      jest
        .spyOn(mockDatabase, "insertOne")
        .mockImplementation(() => Promise.resolve(tUser));
      // act
      const result = await userDataSource.create(inputData);
      // assert
      expect(result).toBeDefined();
      expect(result).toStrictEqual(tUser);
      expect(mockDatabase.insertOne).toHaveBeenCalledWith(inputData);
      expect(mockDatabase.insertOne).toHaveBeenCalledTimes(1);
    });
  });
});
