import { Wallet } from "../../../../src/domain/entities/wallet.entity";
import {
  IWalletRepository,
  WalletQuery,
} from "../../../../src/domain/interfaces/repositories/wallet.repository";
import { WithdrawUseCase } from "../../../../src/domain/useCases/wallet/withdraw.useCase";
import * as uuid from "uuid";
import { Chance } from "chance";
import { User } from "../../../../src/domain/entities/user.entity";
import { IFundWalletUseCase } from "../../../../src/domain/interfaces/useCases/wallet/fundWallet.useCase";
import { Errors } from "../../../../src/core/common/errors";
import { IWithdrawUseCase } from "../../../../src/domain/interfaces/useCases/wallet/withdraw.useCase";
import { IntailizatePaymentResponse } from "../../../../src/data/interfaces/dataSources/paymentGateway/paymentGateway";
const chance = new Chance();

describe("Withdraw UseCase", () => {
  class MockWalletRepository implements IWalletRepository {
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
  let withdrawUseCase: IWithdrawUseCase;
  beforeEach(() => {
    jest.clearAllMocks();
    mockWalletRepository = new MockWalletRepository();
    withdrawUseCase = new WithdrawUseCase(mockWalletRepository);
  });

  let tUser: User = {
    id: uuid.v4(),
    email: chance.email(),
    password: chance.sentence(),
  };

  const tUserWallet: Wallet = {
    id: uuid.v4(),
    accountNo: "000000000",
    balance: 1000,
    user: tUser,
  };
  test("should withdraw specified amount from wallet", async () => {
    // arrange
    const tAmount = 100;
    const tUserId = uuid.v4();
    const newBalance = (tUserWallet.balance as number) - tAmount;
    jest
      .spyOn(mockWalletRepository, "findByUserId")
      .mockImplementation(() => Promise.resolve(tUserWallet));
    jest
      .spyOn(mockWalletRepository, "update")
      .mockImplementation(() => Promise.resolve(tUserWallet));
    // act
    const result = await withdrawUseCase.execute(tAmount, tUserId);
    // assert
    expect(result).toBeDefined();
    expect(result.accountNo).toBe(tUserWallet.accountNo);
    expect(result.id).toBe(tUserWallet.id);
    expect(result.user).toStrictEqual(tUserWallet.user);
    expect(result.balance).toBe(newBalance);
    expect(mockWalletRepository.findByUserId).toBeCalledTimes(1);
    expect(mockWalletRepository.update).toBeCalledTimes(1);
  });

  test("should throw Error if user wallet is not found", async () => {
    try {
      // arrange
      const tAmount = 100;
      const tUserId = uuid.v4();
      jest
        .spyOn(mockWalletRepository, "findByUserId")
        .mockImplementation(() => Promise.resolve(null));
      // act
      await withdrawUseCase.execute(tAmount, tUserId);
      // assert
      expect(mockWalletRepository.findByUserId).toBeCalledTimes(1);
    } catch (error) {
      // assert
      expect(error).toBeDefined();
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe(Errors.WALLET_NOT_FOUND);
    }
  });

  test("should throw Error if user update failed", async () => {
    try {
      // arrange
      const tAmount = 100;
      const tUserId = uuid.v4();
      jest
        .spyOn(mockWalletRepository, "findByUserId")
        .mockImplementation(() => Promise.resolve(tUserWallet));
      jest
        .spyOn(mockWalletRepository, "update")
        .mockImplementation(() => Promise.resolve(null));
      // act
      await withdrawUseCase.execute(tAmount, tUserId);
      // assert
      expect(mockWalletRepository.findByUserId).toBeCalledTimes(1);
      expect(mockWalletRepository.update).toBeCalledTimes(1);

    } catch (error) {
      // assert
      expect(error).toBeDefined();
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe(Errors.SOMETHING_WENT_WRONG);
    }
  });
});
