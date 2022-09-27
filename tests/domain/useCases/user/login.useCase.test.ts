import { User } from "../../../../src/domain/entities/user.entity";
import { LoginUseCase } from "../../../../src/domain/useCases/user/login.useCase";
import { IUserRepository } from "../../../../src/domain/interfaces/repositories/user.repository";
import { Chance } from "chance";
const chance = new Chance();
import * as uuid from "uuid";
import { CryptBox } from "../../../../src/core/utils/cryptBox";
import { ILoginUsecase } from "../../../../src/domain/interfaces/useCases/user/login.useCase";
import { Errors } from "../../../../src/core/common/errors";

describe("Login UseCase", () => {
  class MockUserRepository implements IUserRepository {
    login(email: string, password: string): Promise<User | null> {
      throw new Error("Method not implemented.");
    }
    create(user: User): Promise<User> {
      throw new Error("Method not implemented.");
    }
    findBy(query: {}): Promise<User> {
      throw new Error("Method not implemented.");
    }
    isExistingEmail(email: string): Promise<boolean> {
      throw new Error("Method not implemented.");
    }
  }

  let mockUserRepository: IUserRepository;
  let loginUseCase: ILoginUsecase;
  beforeEach(() => {
    jest.clearAllMocks();
    mockUserRepository = new MockUserRepository();
    loginUseCase = new LoginUseCase(mockUserRepository);
  });

  let tEmail = chance.email();
  let tPassword = chance.sentence();
  let tUser: User = {
    id: uuid.v4(),
    email: tEmail,
    password: tPassword,
  };
  test("should return user", async () => {
    // arrange
    jest
      .spyOn(mockUserRepository, "login")
      .mockImplementation(() => Promise.resolve(tUser));

    // act
    const result = await loginUseCase.execute(tEmail, tPassword);
    // assert
    expect(result).toBeDefined();
    expect(result).toStrictEqual(tUser);
    expect(mockUserRepository.login).toBeCalledTimes(1);
  });

  test("should throw [ResponseError] if user inputs invalid credentials", async () => {
    try {
      // arrange
      let tEmail = chance.email();
      let tPassword = chance.sentence();
      jest
        .spyOn(mockUserRepository, "login")
        .mockImplementation(() => Promise.resolve(null));
      // act
      await loginUseCase.execute(tEmail, tPassword);
      expect(mockUserRepository.login).toBeCalledTimes(1)
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe(Errors.INVALID_CREDENTIALS);
    }
  });
});
