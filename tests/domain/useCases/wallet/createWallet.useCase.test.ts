import { User } from "../../../../src/domain/entities/user.entity";
import { Wallet } from "../../../../src/domain/entities/wallet.entity";
import { IWalletRepository } from "../../../../src/domain/interfaces/repositories/wallet.repository";
import { CreateWalletUseCase } from "../../../../src/domain/useCases/wallet/createWallet.useCase";
import { Chance } from "chance";
import * as uuid from "uuid";
import { Errors } from "../../../../src/core/common/errors";
import { AccountVerificationResponse, Bank, IntailizatePaymentResponse } from "../../../../src/data/interfaces/dataSources/paymentGateway/paymentGateway";
const chance = new Chance();

describe("CreateWallet UseCase ", () => {
  // Test: data should be of type [Wallet]
  class MockWalletRepository implements IWalletRepository {
    initaiteWithdrawal(amount: number, userId: string): Promise<boolean> {
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
    findByUserId(userId: string): Promise<Wallet> {
      throw new Error("Method not implemented.");
    }
    update(wallet: Wallet): Promise<Wallet> {
      throw new Error("Method not implemented.");
    }
    createWallet(wallet: Wallet): Promise<Wallet> {
      throw new Error("Method not implemented.");
    }
    findBy(query: {}): Promise<Wallet> {
      throw new Error("Method not implemented.");
    }
  }
  let mockWalletRepository: IWalletRepository;
  beforeEach(() => {
    jest.clearAllMocks;
    mockWalletRepository = new MockWalletRepository();
  });

  let tUser = {
    id: uuid.v4(),
    email: chance.email(),
    password: chance.sentence(),
  };
  const tInputData = {
    userId: tUser.id,
  };
  const tWallet: Wallet = {
    id: uuid.v4(),
    balance: 0.0,
    accountNo: "000000000",
    ...tInputData,
  };
  test("should create wallet", async () => {
    // arrange
    jest
      .spyOn(mockWalletRepository, "createWallet")
      .mockImplementation(() => Promise.resolve(tWallet));
    jest
      .spyOn(mockWalletRepository, "findByUserId")
      .mockImplementation(() => Promise.resolve(null));
    const createWalletUseCase = new CreateWalletUseCase(mockWalletRepository);
    // act
    const result = await createWalletUseCase.execute(tInputData);
    // assert
    expect(result).toBeDefined();
    expect(result).toStrictEqual(tWallet);
    expect(mockWalletRepository.createWallet).toBeCalledTimes(1);
    expect(mockWalletRepository.findByUserId).toBeCalledTimes(1);
  });
  test("should throw [Validation Error] if user already has wallet", async () => {
    try {
      //arrange
      jest
        .spyOn(mockWalletRepository, "findByUserId")
        .mockImplementation(() => Promise.resolve(tWallet));

      const createWalletUseCase = new CreateWalletUseCase(mockWalletRepository);
      // act
      const result = await createWalletUseCase.execute(tInputData);
    } catch (error) {
      // assert
      expect(error).toBeDefined();
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe(Errors.VALIDATION_ERROR);
      expect(mockWalletRepository.findByUserId).toBeCalledTimes(1);
    }
  });

  // test('should throw [Validation Error] if user does not exist', async () => {
  //   try {
  //     //arrange
  //     let tUser: User = {
  //      id: uuid.v4(),
  //      email: chance.email(),
  //      password: chance.sentence(),
  //    };
  //    const tInputData = {
  //      user: tUser,
  //    };
  //    const tWallet: Wallet = {
  //      id: uuid.v4(),
  //      balance: 0.0,
  //      accountNo: "000000000",
  //      ...tInputData,
  //    };
  //    jest
  //      .spyOn(mockWalletRepository, "findByUserId")
  //      .mockImplementation(() => Promise.resolve(tWallet));

  //    const createWalletUseCase = new CreateWalletUseCase(mockWalletRepository);
  //    // act
  //    const result = await createWalletUseCase.execute(tInputData);
  //   } catch (error) {
  //    // assert
  //    expect(error).toBeDefined()
  //    expect(error.statusCode).toBe(400);
  //    expect(error.message).toBe("Validation Error")
  //   }

  //  });
});
