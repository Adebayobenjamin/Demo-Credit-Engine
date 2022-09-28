import { Wallet } from "../../../../src/domain/entities/wallet.entity";
import {
  IWalletRepository,
  WalletQuery,
} from "../../../../src/domain/interfaces/repositories/wallet.repository";
import { FundWalletUseCase } from "../../../../src/domain/useCases/wallet/fundWallet.useCase";
import * as uuid from "uuid";
import { Chance } from "chance";
import { User } from "../../../../src/domain/entities/user.entity";
import { IFundWalletUseCase } from "../../../../src/domain/interfaces/useCases/wallet/fundWallet.useCase";
import { Errors } from "../../../../src/core/common/errors";
import { AccountVerificationResponse, Bank, IntailizatePaymentResponse } from "../../../../src/data/interfaces/dataSources/paymentGateway/paymentGateway";
const chance = new Chance();

describe("FundWallet UseCase ", () => {
  class MockWalletRepository implements IWalletRepository {
    initaiteWithdrawal(amount: number, accountName: string, accountNumber: string, bankCode: string, walletId: string): Promise<boolean> {
      throw new Error("Method not implemented.");
    }
    getBanks(): Promise<Bank[]> {
      throw new Error("Method not implemented.");
    }
    verifyAccountNumber(accountNumber: string, bankCode: string): Promise<AccountVerificationResponse> {
      throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<Wallet | null> {
      throw new Error("Method not implemented.");
    }
    initiateFunding(
      amount: number,
      wallet: Wallet
    ): Promise<IntailizatePaymentResponse> {
      throw new Error("Method not implemented.");
    }
    createWallet(wallet: Wallet): Promise<Wallet> {
      throw new Error("Method not implemented.");
    }
    update(wallet: Wallet): Promise<Wallet> {
      throw new Error("Method not implemented.");
    }
    findBy(query: WalletQuery): Promise<Wallet | null> {
      throw new Error("Method not implemented.");
    }
    findByUserId(userId: string): Promise<Wallet | null> {
      throw new Error("Method not implemented.");
    }
  }

  let mockWalletRepository: IWalletRepository;
  let fundWalletUseCase: IFundWalletUseCase;
  beforeEach(() => {
    jest.clearAllMocks();
    mockWalletRepository = new MockWalletRepository();
    fundWalletUseCase = new FundWalletUseCase(mockWalletRepository);
  });

  let tUser = {
    id: uuid.v4(),
    email: chance.email(),
    password: chance.sentence(),
  };

  const tUserWallet: Wallet = {
    id: uuid.v4(),
    accountNo: "000000000",
    balance: 1000,
    userId: tUser.id,
  };
  test("should Fund wallet with specified amount", async () => {
    // arrange
    const tAmount = 100;
    const tUserId = uuid.v4();
    const newBalance = (tUserWallet.balance as number) + tAmount;
    jest
      .spyOn(mockWalletRepository, "findById")
      .mockImplementation(() => Promise.resolve(tUserWallet));
    jest
      .spyOn(mockWalletRepository, "update")
      .mockImplementation(() => Promise.resolve(tUserWallet));
    // act
    const result = await fundWalletUseCase.execute(tAmount, tUserId);
    // assert
    expect(result).toBeDefined();
    expect(result.accountNo).toBe(tUserWallet.accountNo);
    expect(result.id).toBe(tUserWallet.id);
    expect(result.userId).toStrictEqual(tUserWallet.userId);
    expect(result.balance).toBe(newBalance);
    expect(mockWalletRepository.findById).toBeCalledTimes(1);
    expect(mockWalletRepository.update).toBeCalledTimes(1);
  });

  test("should throw Error if user wallet is not found", async () => {
    try {
      // arrange
      const tAmount = 100;
      const tUserId = uuid.v4();
      jest
        .spyOn(mockWalletRepository, "findById")
        .mockImplementation(() => Promise.resolve(null));
      // act
      await fundWalletUseCase.execute(tAmount, tUserId);
      // assert
      expect(mockWalletRepository.findById).toBeCalledTimes(1);
    } catch (error) {
      // assert
      expect(error).toBeDefined();
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe(Errors.WALLET_NOT_FOUND);
    }
  });

  test("should throw Error if wallet update failed", async () => {
    try {
      // arrange
      const tAmount = 100;
      const tUserId = uuid.v4();
      jest
        .spyOn(mockWalletRepository, "findById")
        .mockImplementation(() => Promise.resolve(tUserWallet));
      jest
        .spyOn(mockWalletRepository, "update")
        .mockImplementation(() => Promise.resolve(null));
      // act
     const result = await fundWalletUseCase.execute(tAmount, tUserId);
      // assert
      expect(result).toBeNull()
      expect(mockWalletRepository.findById).toBeCalledTimes(1);
      expect(mockWalletRepository.update).toBeCalledTimes(1);

    } catch (error) {
      // assert
      expect(error).toBeDefined();
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe(Errors.SOMETHING_WENT_WRONG);
    }
  });
});
