import { Bank } from "../../../data/interfaces/dataSources/paymentGateway/paymentGateway";
import { IWalletRepository } from "../../interfaces/repositories/wallet.repository";
import { IGetBanksUseCase } from "../../interfaces/useCases/wallet/getBanks.useCase";

export class GetBanksUseCase implements IGetBanksUseCase {
  walletRepository: IWalletRepository;
  constructor(walletRepository: IWalletRepository){
    this.walletRepository = walletRepository
  }

  execute(): Promise<Bank[]> {
    return this.walletRepository.getBanks();
  }
}
