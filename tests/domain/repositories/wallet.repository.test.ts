import { IWalletDataSource } from "../../../src/data/interfaces/dataSources/wallet.dataSource";
import { Wallet } from "../../../src/domain/entities/wallet.entity";
import { IWalletRepository } from "../../../src/domain/interfaces/repositories/wallet.repository";
import { WalletRepository } from "../../../src/domain/repositories/wallet.repository";
import {
  AccountVerificationResponse,
  Bank,
  IntailizatePaymentResponse,
  IPaymentGateway,
} from "../../../src/data/interfaces/dataSources/paymentGateway/paymentGateway";
import { User } from "../../../src/domain/entities/user.entity";
import { Chance } from "chance";
import * as uuid from "uuid";
const chance = new Chance();
describe("Wallet Repository", () => {
  class MockWalletDataSource implements IWalletDataSource {
    findByUserId(id: string): Promise<Wallet | null> {
      throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<Wallet | null> {
      throw new Error("Method not implemented.");
    }
    findOne(query: {}): Promise<Wallet | null> {
      throw new Error("Method not implemented.");
    }
    create(data: Wallet): Promise<Wallet> {
      throw new Error("Method not implemented.");
    }
    update(data: Wallet): Promise<Wallet> {
      throw new Error("Method not implemented.");
    }
  }
  class MockPaymentGateway implements IPaymentGateway {
    verifyAccountNumber(
      accountNumber: string,
      bankCode: string
    ): Promise<AccountVerificationResponse> {
      throw new Error("Method not implemented.");
    }
    getBanks(): Promise<Bank[]> {
      throw new Error("Method not implemented.");
    }

    initiatePayment(payload: any): Promise<any> {
      throw new Error("Method not implemented.");
    }
    withdrawFromBankAccount(payload: any): Promise<any> {
      throw new Error("Method not implemented.");
    }
    verifyTransaction(payload: any): Promise<any> {
      throw new Error("Method not implemented.");
    }
  }

  let mockWalletDataSource: IWalletDataSource;
  let mockPaymentGateway: IPaymentGateway;
  let walletRepository: IWalletRepository;

  beforeAll(() => {
    mockWalletDataSource = new MockWalletDataSource();
    mockPaymentGateway = new MockPaymentGateway();
    walletRepository = new WalletRepository(
      mockWalletDataSource,
      mockPaymentGateway
    );
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  let tUser = {
    id: uuid.v4(),
    email: chance.email(),
    password: chance.sentence(),
  };
  const tInputData = {
    accountNo: "000000000",
    userId: tUser.id,
  };
  const tWallet: Wallet = {
    id: uuid.v4(),
    balance: 0.0,
    ...tInputData,
  };
  describe("Create", () => {
    test("should create and return wallet", async () => {
      // arrange
      jest
        .spyOn(mockWalletDataSource, "create")
        .mockImplementation(() => Promise.resolve(tWallet));
      // act
      const result = await walletRepository.createWallet(tInputData);
      // assert
      expect(result).toBeDefined();
      expect(result).toStrictEqual(tWallet);
      expect(mockWalletDataSource.create).toBeCalledTimes(1);
    });
  });

  describe("Update", () => {
    test("should update and return wallet", async () => {
      // arrange
      jest
        .spyOn(mockWalletDataSource, "update")
        .mockImplementation(() => Promise.resolve(tWallet));
      // act
      const result = await walletRepository.update(tWallet);
      // assert
      expect(result).toBeDefined();
      expect(result).toStrictEqual(tWallet);
      expect(mockWalletDataSource.update).toBeCalledTimes(1);
    });

    test("should return null if wallet does not exist", async () => {
      // arrange
      jest
        .spyOn(mockWalletDataSource, "update")
        .mockImplementation(() => Promise.resolve(null));
      // act
      const result = await walletRepository.update(tWallet);
      // assert
      expect(result).toBeNull();
      expect(mockWalletDataSource.update).toBeCalledTimes(1);
    });
  });

  describe("findBy", () => {
    test("should find wallet", async () => {
      // arrange
      jest
        .spyOn(mockWalletDataSource, "findOne")
        .mockImplementation(() => Promise.resolve(tWallet));
      // act
      const result = await walletRepository.findBy({
        accountNo: tWallet.accountNo,
      });
      // assert
      expect(result).toBeDefined();
      expect(result).toStrictEqual(tWallet);
      expect(mockWalletDataSource.findOne).toBeCalledTimes(1);
    });
    test("should return null if wallet does not exist", async () => {
      // arrange
      jest
        .spyOn(mockWalletDataSource, "findOne")
        .mockImplementation(() => Promise.resolve(null));
      // act
      const result = await walletRepository.findBy({
        accountNo: tWallet.accountNo,
      });
      // assert
      expect(result).toBeNull();
      expect(mockWalletDataSource.findOne).toBeCalledTimes(1);
    });
  });

  describe("FindByUserId", () => {
    test("should find wallet by userId", async () => {
      // arrange
      jest
        .spyOn(mockWalletDataSource, "findByUserId")
        .mockImplementation(() => Promise.resolve(tWallet));
      // act
      const result = await walletRepository.findByUserId(tUser.id);
      // assert
      expect(result).toBeDefined();
      expect(result).toStrictEqual(tWallet);
      expect(mockWalletDataSource.findByUserId).toBeCalledTimes(1);
    });
    test("should return null if wallet does not exist", async () => {
      // arrange
      jest
        .spyOn(mockWalletDataSource, "findOne")
        .mockImplementation(() => Promise.resolve(null));
      // act
      const result = await walletRepository.findBy({
        accountNo: tWallet.accountNo,
      });
      // assert
      expect(result).toBeNull();
      expect(mockWalletDataSource.findOne).toBeCalledTimes(1);
    });
  });

  describe("InitiateFunding", () => {
    test("should initiate payment with paymentGateway", async () => {
      // arrange
      const tPaymentInitializationResponse: IntailizatePaymentResponse = {
        status: true,
        paymentUrl: chance.url(),
        paymentCode: chance.guid({ version: 4 }),
        reference: uuid.v4(),
      };
      const tAmount = 100;
      jest
        .spyOn(mockPaymentGateway, "initiatePayment")
        .mockImplementation(() =>
          Promise.resolve(tPaymentInitializationResponse)
        );
      // act
      const result = await walletRepository.initiateFunding(tAmount, tWallet);
      // assert
      expect(result).toBeDefined();
      expect(result).toStrictEqual(tPaymentInitializationResponse);
      expect(mockPaymentGateway.initiatePayment).toBeCalledTimes(1);
    });
  });

  describe("getBanks", () => {
    const tBanks = [
      {
        id: 302,
        name: "9mobile 9Payment Service Bank",
        slug: "9mobile-9payment-service-bank-ng",
        code: "120001",
        longcode: "120001",
        gateway: "",
        pay_with_bank: false,
        active: true,
        country: "Nigeria",
        currency: "NGN",
        type: "nuban",
        is_deleted: false,
        createdAt: "2022-05-31T06:50:27.000Z",
        updatedAt: "2022-06-23T09:33:55.000Z",
      },
    ];
    test("should get banks list", async () => {
      // arrange
      jest
        .spyOn(mockPaymentGateway, "getBanks")
        .mockImplementation(() => Promise.resolve(tBanks));
      // act
      const result = await walletRepository.getBanks();
      // assert
      expect(result).toBeDefined();
      expect(result).toStrictEqual(tBanks);
      expect(mockPaymentGateway.getBanks).toBeCalledTimes(1);
    });
  });

  test("should verifyAccount Number", async () => {
    // arrange
    const tVerificationResponse = {
      status: true,
      accountName: chance.name(),
      accountNumber: chance.string(),
    };
    const tPayload = {
      accountNumber: chance.string(),
      bankCode: chance.string(),
    };
    jest
      .spyOn(mockPaymentGateway, "verifyAccountNumber")
      .mockImplementation(() => Promise.resolve(tVerificationResponse));
    // act
    const result = await walletRepository.verifyAccountNumber(tPayload.accountNumber, tPayload.bankCode);
    // assert
    expect(result).toBeDefined();
    expect(result).toStrictEqual(tVerificationResponse);
    expect(mockPaymentGateway.verifyAccountNumber).toBeCalledTimes(1);
  });
  
});

