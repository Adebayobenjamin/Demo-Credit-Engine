import { Wallet } from "../../../../src/domain/entities/wallet.entity";
import {
  IWalletRepository,
  WalletQuery,
} from "../../../../src/domain/interfaces/repositories/wallet.repository";
import { IGetWalletByUserIdUseCase } from "../../../../src/domain/interfaces/useCases/wallet/getWalletByUserId.useCase";
import { GetWalletByUserIdUseCase } from "../../../../src/domain/useCases/wallet/getWalletByUserId.useCase";
import * as uuid from "uuid";
import { Chance } from "chance";
import { User } from "../../../../src/domain/entities/user.entity";
import { Errors } from "../../../../src/core/common/errors";
import { AccountVerificationResponse, Bank, IntailizatePaymentResponse } from "../../../../src/data/interfaces/dataSources/paymentGateway/paymentGateway";
const chance = new Chance();

describe("GetWalletByUserId UseCase", () => {
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
    createWallet(wallet: Wallet): Promise<Wallet> {
      throw new Error("Method not implemented.");
    }
    update(wallet: Wallet): Promise<Wallet> {
      throw new Error("Method not implemented.");
    }
    findBy(query: WalletQuery): Promise<Wallet | null> {
      throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<Wallet | null> {
      throw new Error("Method not implemented.");
    }
    findByUserId(userId: string): Promise<Wallet | null> {
      throw new Error("Method not implemented.");
    }
    initiateFunding(
      amount: number,
      wallet: Wallet
    ): Promise<IntailizatePaymentResponse> {
      throw new Error("Method not implemented.");
    }
  }

  let mockWalletRepository: IWalletRepository;
  let getWalletByUserIdUseCase: IGetWalletByUserIdUseCase;

  beforeEach(() => {
    mockWalletRepository = new MockWalletRepository();
    getWalletByUserIdUseCase = new GetWalletByUserIdUseCase(
      mockWalletRepository
    );
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
    userId: tUser.id ,
  };
  const tUserId = uuid.v4();

  test("should return user wallet", async () => {
    // arrange
    jest
      .spyOn(mockWalletRepository, "findByUserId")
      .mockImplementation(() => Promise.resolve(tUserWallet));
    // act
    const result = await getWalletByUserIdUseCase.execute(tUserId);
    // assert
    expect(result).toBeDefined();
    expect(result).toStrictEqual(tUserWallet);
    expect(mockWalletRepository.findByUserId).toBeCalledTimes(1);
  });

  test("should throw Error if user wallet is not found", async () => {
    try {
      // arrange
      jest
        .spyOn(mockWalletRepository, "findByUserId")
        .mockImplementation(() => Promise.resolve(null));
      // act
      const result = await getWalletByUserIdUseCase.execute(tUserId);
      // assert
      expect(mockWalletRepository.findByUserId).toBeCalledTimes(1);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe(Errors.WALLET_NOT_FOUND);
    }
  });
});
