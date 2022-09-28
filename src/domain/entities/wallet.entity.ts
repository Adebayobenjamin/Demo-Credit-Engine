import { User } from "./user.entity";

export interface Wallet {
    id?: string;
    accountNo?: string;
    balance?: number;
    userId: string
}
