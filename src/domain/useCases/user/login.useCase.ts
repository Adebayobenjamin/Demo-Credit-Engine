import {  } from "tsyringe";
import { Errors } from "../../../core/common/errors";
import { ResponseError } from "../../../core/common/Response";
import { CryptBox } from "../../../core/utils/cryptBox";
import { User } from "../../entities/user.entity";
import { IUserRepository } from "../../interfaces/repositories/user.repository";
import { ILoginUseCase } from "../../interfaces/useCases/user/login.useCase";


export class LoginUseCase implements ILoginUseCase {
  userRepository: IUserRepository;
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(email: string, password: string): Promise<User> {
    const user = await this.userRepository.login(email, password);
    if(!user) throw new ResponseError({
        statusCode: 401,
        message: Errors.INVALID_CREDENTIALS,
    })
    return user;
  }
  
}
