import { Bank } from "../../../../data/interfaces/dataSources/paymentGateway/paymentGateway";
import { Wallet } from "../../../entities/wallet.entity";
/***
 * GetBanks UseCase Contract
 * 
 * This specifies what the getBanks usecase can do
 */
export interface IGetBanksUseCase {
  execute(): Promise<Bank[]>;
}
