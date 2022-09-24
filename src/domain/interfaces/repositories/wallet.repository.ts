import { Wallet } from "../../entities/wallet.entity";
/**
 * Wallet Repository Contract.
 * 
 * This specifies what the wallet repository can do
 */
export interface IWallet {
  createWallet(wallet: Wallet): Promise<Wallet>;
  fundWallet(amount: number, wallet: Wallet): Promise<Wallet>;
  withdraw(amount: number, wallet: Wallet): Promise<Wallet>;
  transfer(amount: number, senderWallet: Wallet, recieverWallet: Wallet): Promise<boolean>;
  findBy(query: {}): Promise<Wallet>
}
