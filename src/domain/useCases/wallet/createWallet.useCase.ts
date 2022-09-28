import { Errors } from "../../../core/common/errors";
import { ResponseError, ValidationError } from "../../../core/common/Response";
import { Wallet } from "../../entities/wallet.entity";
import { IWalletRepository } from "../../interfaces/repositories/wallet.repository";
import { ICreateWalletUseCase } from "../../interfaces/useCases/wallet/createWallet.useCase";

export class CreateWalletUseCase implements ICreateWalletUseCase {
  walletRepository: IWalletRepository;
  constructor(walletRepository: IWalletRepository) {
    this.walletRepository = walletRepository;
  }

  #generateAccountNo(): string {
    let nums = "0123456789";
    let accountNo = "";
    for (let i = 0; i < 10; i++) {
      let index = Math.floor(Math.random() * nums.length);
      accountNo += nums[index];
    }
    return accountNo;
  }

  async #validate(wallet: Wallet): Promise<ValidationError[]> {
    let returnable: ValidationError[] = [];
    // check if user exists
    // const userExists =
    // check is user already has wallet
    const isExistingWallet =
      (await this.walletRepository.findByUserId(wallet.userId)) != null;
    if (isExistingWallet)
      returnable.push(
        new ValidationError({
          field: "user",
          message: Errors.USER_ALREADY_HAS_WALLET,
        })
      );
    return returnable;
  }
  async execute(wallet: Wallet): Promise<Wallet> {
    const validationErrors = await this.#validate(wallet);
    if (validationErrors.length > 0)
      throw new ResponseError({
        statusCode: 400,
        message: Errors.VALIDATION_ERROR,
        validationErrors,
      });
    wallet.accountNo = this.#generateAccountNo();
    return this.walletRepository.createWallet(wallet);
  }
}
