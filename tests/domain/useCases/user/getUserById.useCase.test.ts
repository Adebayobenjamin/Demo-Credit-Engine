import { User } from "../../../../src/domain/entities/user.entity";
import { GetUserByIdUseCase } from "../../../../src/domain/useCases/user/getUserById.useCase";
import { IUserRepository } from "../../../../src/domain/interfaces/repositories/user.repository";
import { Chance } from "chance";
const chance = new Chance();
import * as uuid from "uuid";
import { IGetUserByIdUseCase } from "../../../../src/domain/interfaces/useCases/user/getUserById.useCase";
import { Errors } from "../../../../src/core/common/errors";

describe("GetUserById UseCase", () => {
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
  let getUserByIdUseCase: IGetUserByIdUseCase;
  beforeEach(() => {
    jest.clearAllMocks();
    mockUserRepository = new MockUserRepository();
    getUserByIdUseCase = new GetUserByIdUseCase(mockUserRepository);
  });

  let tUserId = uuid.v4();

  let tUser: User = {
    id: tUserId,
    email: chance.email(),
    password: chance.sentence(),
  };
  test("should return user", async () => {
    // arrange
    jest
      .spyOn(mockUserRepository, "findBy")
      .mockImplementation(() => Promise.resolve(tUser));

    // act
    const result = await getUserByIdUseCase.execute(tUserId);
    // assert
    expect(result).toBeDefined();
    expect(result).toStrictEqual(tUser);
    expect(result.id).toBe(tUserId)
    expect(mockUserRepository.findBy).toBeCalledTimes(1);
  });

  test("should throw [ResponseError] if user inputs invalid credentials", async () => {
    try {
      // arrange
      let tEmail = chance.email();
      let tPassword = chance.sentence();
      jest
        .spyOn(mockUserRepository, "findBy")
        .mockImplementation(() => Promise.resolve(null));
      // act
      await getUserByIdUseCase.execute(tUserId);
      expect(mockUserRepository.findBy).toBeCalledTimes(1);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe(Errors.USER_NOT_FOUND);
    }
  });
});
