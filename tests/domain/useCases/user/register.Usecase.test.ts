import { User } from "../../../../src/domain/entities/user.entity";
import { IUserRepository } from "../../../../src/domain/interfaces/repositories/user.repository";
import { Chance } from "chance";
const chance = new Chance();
import * as uuid from "uuid";
import { IRegisterUsecase } from "../../../../src/domain/interfaces/useCases/user/register.useCase";
import { RegisterUseCase } from "../../../../src/domain/useCases/user/register.useCase";
import { ValidationError } from "../../../../src/core/common/Response";

describe("Register UseCase", () => {
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
  let registerUserUseCase: IRegisterUsecase;
  beforeEach(() => {
    jest.clearAllMocks();
    mockUserRepository = new MockUserRepository();
    registerUserUseCase = new RegisterUseCase(mockUserRepository);
  });

  test("should add user", async () => {
    // arrange
    const inputData: User = {
      email: chance.email(),
      password: chance.sentence(),
    };
    const tRegisteredUser: User = {
      ...inputData,
      id: uuid.v4(),
    };
    jest
      .spyOn(mockUserRepository, "isExistingEmail")
      .mockImplementation(() => Promise.resolve(false));
    jest
      .spyOn(mockUserRepository, "create")
      .mockImplementation(() => Promise.resolve(tRegisteredUser));
    //   act
    const result = await registerUserUseCase.execute(inputData);
    // assert
    expect(result).toBeDefined();
    expect(result).toStrictEqual(tRegisteredUser);
    expect(mockUserRepository.create).toBeCalled();
  });

  test("should throw [Validation Error] if email exists", async () => {
    const inputData: User = {
      email: chance.email(),
      password: chance.sentence(),
    };
    try {
      jest
        .spyOn(mockUserRepository, "isExistingEmail")
        .mockImplementation(() => Promise.resolve(true));
      //   act
      await registerUserUseCase.execute(inputData);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.statusCode).toBe(400);
      expect(error.validationErrors).toStrictEqual([
        new ValidationError({
          field: "email",
          message: `email ${inputData.email} already exists`,
        }),
      ]);
    }
  });
});
