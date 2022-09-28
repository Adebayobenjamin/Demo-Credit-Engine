import { Errors } from "../../../core/common/errors";
import { ResponseError } from "../../../core/common/Response";
import { User } from "../../entities/user.entity";
import { IUserRepository } from "../../interfaces/repositories/user.repository";
import { IGetUserByIdUseCase } from "../../interfaces/useCases/user/getUserById.useCase";

export class GetUserByIdUseCase implements IGetUserByIdUseCase {
  userRepository: IUserRepository;
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }
  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findBy({ id: userId });
    if (!user)
      throw new ResponseError({
        statusCode: 401,
        message: Errors.USER_NOT_FOUND,
      });
    return user;
  }
}
