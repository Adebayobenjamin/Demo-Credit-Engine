import { Wallet } from "../../../../src/domain/entities/wallet.entity";
import {
  IWalletRepository,
  WalletQuery,
} from "../../../../src/domain/interfaces/repositories/wallet.repository";
import { InitiateFundingUseCase } from "../../../../src/domain/useCases/wallet/initiateFunding.useCase";
import * as uuid from "uuid";
import { Chance } from "chance";
import {
  IInitiateFundingUseCase,
} from "../../../../src/domain/interfaces/useCases/wallet/initiateFunding.useCase";
import { User } from "../../../../src/domain/entities/user.entity";
import { Errors } from "../../../../src/core/common/errors";
import { AccountVerificationResponse, Bank, IntailizatePaymentResponse } from "../../../../src/data/interfaces/dataSources/paymentGateway/paymentGateway";
const chance = new Chance();

describe("InitiateFunding UseCase", () => {
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
  let initiateFundingUseCase: IInitiateFundingUseCase;
  beforeEach(() => {
    jest.clearAllMocks();
    mockWalletRepository = new MockWalletRepository();
    initiateFundingUseCase = new InitiateFundingUseCase(mockWalletRepository);
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
  test("should initiate funding", async () => {
    // arrange
    const tPayload = {
      amount: 10,
      userId: uuid.v4(),
    };
    const tPaymentInitializationResponse: IntailizatePaymentResponse = {
      status: true,
      paymentUrl: chance.url(),
      paymentCode: chance.guid({ version: 4 }),
      reference: uuid.v4(),
    };
    jest
      .spyOn(mockWalletRepository, "initiateFunding")
      .mockImplementation(() =>
        Promise.resolve(tPaymentInitializationResponse)
      );
    jest
      .spyOn(mockWalletRepository, "findByUserId")
      .mockImplementation(() => Promise.resolve(tUserWallet));
    // act
    const result = await initiateFundingUseCase.execute(
      tPayload.amount,
      tPayload.userId
    );
    // assert
    expect(result).toBeDefined();
    expect(result).toStrictEqual(tPaymentInitializationResponse);
    expect(mockWalletRepository.initiateFunding).toBeCalledTimes(1);
    expect(mockWalletRepository.findByUserId).toBeCalledTimes(1);
  });
  test("should throw error if user wallet does not exist", async () => {
    try {
      // arrange
      const tPayload = {
        amount: 10,
        userId: uuid.v4(),
      };
      const tPaymentInitializationResponse: IntailizatePaymentResponse = {
        status: true,
        paymentUrl: chance.url(),
        paymentCode: chance.guid({ version: 4 }),
        reference: uuid.v4(),
      };
      jest
        .spyOn(mockWalletRepository, "findByUserId")
        .mockImplementation(() => Promise.resolve(null));
      // act
      await initiateFundingUseCase.execute(tPayload.amount, tPayload.userId);
    } catch (error) {
         // assert
    expect(error).toBeDefined();
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe(Errors.WALLET_NOT_FOUND);
    expect(mockWalletRepository.findByUserId).toBeCalledTimes(1);
    }
   
  });
});
