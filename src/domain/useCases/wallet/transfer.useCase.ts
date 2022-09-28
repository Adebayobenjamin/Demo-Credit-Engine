import {  } from "tsyringe";
import { Errors } from "../../../core/common/errors";
import { ResponseError } from "../../../core/common/Response";
import { User } from "../../entities/user.entity";
import { Wallet } from "../../entities/wallet.entity";
import { IWalletRepository } from "../../interfaces/repositories/wallet.repository";
import { ITransferUseCase } from "../../interfaces/useCases/wallet/transfer.useCase";

export class TransferUseCase implements ITransferUseCase {
  walletRepository: IWalletRepository;
  constructor(walletRepository: IWalletRepository) {
    this.walletRepository = walletRepository;
  }

  async execute(
    amount: number,
    sender: User,
    recieverAccountNo: string
  ): Promise<boolean> {
    // get sender wallet
    const senderWallet = await this.walletRepository.findByUserId(sender.id);
    if (!senderWallet)
      throw new ResponseError({
        statusCode: 400,
        message: Errors.SENDER_WALLET_NOT_FOUND,
      });
    // check account balance
    if (senderWallet.balance < amount)
      throw new ResponseError({
        statusCode: 400,
        message: Errors.INSUFFICIENT_FUNDS,
      });
    //  get reciver wallet
    const recieverWallet = await this.walletRepository.findBy({
      accountNo: recieverAccountNo,
    });
    if (!recieverWallet)
      throw new ResponseError({
        statusCode: 400,
        message: Errors.RECIEVER_WALLET_NOT_FOUND,
      });
    // debit senderWallet
    senderWallet.balance -= amount;
    await this.walletRepository.update(senderWallet);
    //  credit reciever wallet
    recieverWallet.balance += amount;
    await this.walletRepository.update(recieverWallet);
    return true;
  }
}
