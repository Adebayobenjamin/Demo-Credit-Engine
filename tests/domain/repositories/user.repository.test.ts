import { CryptBox } from "../../../src/core/utils/cryptBox";
import { IUserDataSource } from "../../../src/data/interfaces/dataSources/user.dataSource";
import { User } from "../../../src/domain/entities/user.entity";
import { IUserRepository } from "../../../src/domain/interfaces/repositories/user.repository";
import { UserRepository } from "../../../src/domain/repositories/user.repository";
import { Chance } from "chance";
const chance = new Chance();
import * as uuid from "uuid";
describe("User Repository", () => {
  class MockUserDataSource implements IUserDataSource {
    findOne(query: {}): Promise<User | null> {
      throw new Error("Method not implemented.");
    }
    create(data: User): Promise<User> {
      throw new Error("Method not implemented.");
    }
  }
  
  class MockCryptBox extends CryptBox {}
  let mockUserDataSource: IUserDataSource;
  let mockCryptBox: CryptBox;
  let userRepository: IUserRepository;

  beforeAll(() => {
    mockUserDataSource = new MockUserDataSource();
    mockCryptBox = new MockCryptBox();
    userRepository = new UserRepository(mockUserDataSource, mockCryptBox);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  const inputData: User = {
    email: chance.email(),
    password: chance.sentence(),
  };
  const tHashedPassword = "password";
  const tUser: User = {
    ...inputData,
    id: uuid.v4(),
    password: tHashedPassword,
  };
  describe("Create", () => {
    test("should create and return user", async () => {
      // arrange
      jest
        .spyOn(mockUserDataSource, "create")
        .mockImplementation(() => Promise.resolve(tUser));
      jest
        .spyOn(mockCryptBox, "hashString")
        .mockImplementation(() => Promise.resolve(tHashedPassword));
      // act
      const result = await userRepository.create(inputData);
      // assert
      expect(result).toBeDefined();
      expect(result).toStrictEqual(tUser);
      expect(result.password).toBe(tHashedPassword);
      expect(mockCryptBox.hashString).toBeCalledTimes(1);
      expect(mockUserDataSource.create).toBeCalledTimes(1);
    });
  });

  describe("Login", () => {
    test("should login and return user details", async () => {
      // arrange
      jest
        .spyOn(mockUserDataSource, "findOne")
        .mockImplementation(() => Promise.resolve(tUser));
      jest
        .spyOn(mockCryptBox, "verifyHash")
        .mockImplementation(() => Promise.resolve(true));
      // act
      const result = await userRepository.login(
        inputData.email,
        inputData.password
      );
      // assert
      expect(result).toBeDefined();
      expect(result).toStrictEqual(tUser);
      expect((result as User).password).toBe(tHashedPassword);
      expect(mockUserDataSource.findOne).toBeCalledTimes(1);
      expect(mockCryptBox.verifyHash).toBeCalledTimes(1);
    });
    test("should return null on incorrect email", async () => {
      // arrange
      jest
        .spyOn(mockUserDataSource, "findOne")
        .mockImplementation(() => Promise.resolve(null));
      // act
      const result = await userRepository.login(
        inputData.email,
        inputData.password
      );
      // assert
      expect(result).toBeNull();
      expect(mockUserDataSource.findOne).toBeCalledTimes(1);
    });

    test("should return null on incorrect password", async () => {
      // arrange
      jest
        .spyOn(mockUserDataSource, "findOne")
        .mockImplementation(() => Promise.resolve(tUser));
      jest
        .spyOn(mockCryptBox, "verifyHash")
        .mockImplementation(() => Promise.resolve(false));
      // act
      const result = await userRepository.login(
        inputData.email,
        inputData.password
      );
      // assert
      expect(result).toBeNull();
      expect(mockUserDataSource.findOne).toBeCalledTimes(1);
      expect(mockCryptBox.verifyHash).toBeCalledTimes(1);
    });
  });

  describe("FindBy", () => {
    test("should return user data", async () => {
      // arrange
      jest
        .spyOn(mockUserDataSource, "findOne")
        .mockImplementation(() => Promise.resolve(tUser));
      // act
      const result = await userRepository.findBy({ email: inputData.email });
      // assert
      expect(result).toBeDefined();
      expect(result).toStrictEqual(tUser);
      expect(mockUserDataSource.findOne).toBeCalledTimes(1);
    });

    test("should return null if data does not exist", async () => {
      // arrange
      jest
        .spyOn(mockUserDataSource, "findOne")
        .mockImplementation(() => Promise.resolve(null));
      // act
      const result = await userRepository.findBy({ email: inputData.email });
      // assert
      expect(result).toBeNull();
      expect(mockUserDataSource.findOne).toBeCalledTimes(1);
    });
  });

  describe("isExistingEmail", () => {
    test("should return true if email exists", async () => {
      // arrange
      jest
        .spyOn(mockUserDataSource, "findOne")
        .mockImplementation(() => Promise.resolve(tUser));
      // act
      const result = await userRepository.isExistingEmail(inputData.email);
      // assert
      expect(result).toBeDefined();
      expect(result).toStrictEqual(true);
      expect(mockUserDataSource.findOne).toBeCalledTimes(1);
    });
    test("should return false if email deoes not exists", async () => {
      // arrange
      jest
        .spyOn(mockUserDataSource, "findOne")
        .mockImplementation(() => Promise.resolve(null));
      // act
      const result = await userRepository.isExistingEmail(inputData.email);
      // assert
      expect(result).toBeDefined();
      expect(result).toStrictEqual(false);
      expect(mockUserDataSource.findOne).toBeCalledTimes(1);
    });
  });
});
