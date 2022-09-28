import { ResponseError, ValidationError } from "../../../core/common/Response";
import { CryptBox } from "../../../core/utils/cryptBox";
import { User } from "../../entities/user.entity";
import { IUserRepository } from "../../interfaces/repositories/user.repository";
import { IRegisterUseCase } from "../../interfaces/useCases/user/register.useCase";

export const UNIQUE_EMAIL_ERROR = "email already exists";
export class RegisterUseCase implements IRegisterUseCase {
  userRepository: IUserRepository;
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }
  #validate = async (user: User): Promise<ValidationError[]> => {
    let returnable: ValidationError[] = [];
    const isExistingEmail = await this.userRepository.isExistingEmail(
      user.email
    );
    if (isExistingEmail)
      returnable.push(
        new ValidationError({
          field: "email",
          message: `email ${user.email} already exists`,
        })
      );

    return returnable;
  };

  async execute(user: User): Promise<User> {
    let validationErrors = await this.#validate(user);
    if (validationErrors.length > 0)
      throw new ResponseError({
        statusCode: 400,
        message: "Validation Error",
        validationErrors,
      });
    return this.userRepository.create(user);
  }
}
