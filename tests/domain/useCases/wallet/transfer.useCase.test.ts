import { Wallet } from "../../../../src/domain/entities/wallet.entity";
import { IWalletRepository } from "../../../../src/domain/interfaces/repositories/wallet.repository";
import { TransferUseCase } from "../../../../src/domain/useCases/wallet/transfer.useCase";
import { Chance } from "chance";
import * as uuid from "uuid";
import { User } from "../../../../src/domain/entities/user.entity";
import { ITransferUseCase } from "../../../../src/domain/interfaces/useCases/wallet/transfer.useCase";
import { Errors } from "../../../../src/core/common/errors";
import { IntailizatePaymentResponse } from "../../../../src/data/interfaces/dataSources/paymentGateway/paymentGateway";
const chance = new Chance();

describe("Transfer UseCase ", () => {
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
  let transferUseCase: ITransferUseCase;
  beforeEach(() => {
    jest.clearAllMocks;
    mockWalletRepository = new MockWalletRepository();
    transferUseCase = new TransferUseCase(mockWalletRepository);
  });
  let tSender: User = {
    id: uuid.v4(),
    email: chance.email(),
    password: chance.sentence(),
  };
  let tRciever: User = {
    id: uuid.v4(),
    email: chance.email(),
    password: chance.sentence(),
  };
  const tSenderWallet: Wallet = {
    id: uuid.v4(),
    accountNo: "000000000",
    balance: 1000,
    user: tSender,
  };
  const tRecieverWallet: Wallet = {
    id: uuid.v4(),
    accountNo: "000000000",
    balance: 100,
    user: tRciever,
  };

  test("should transfer specified amount from sender wallet to reciever wallet", async () => {
    // arrange
    const tPayload = {
      sender: tSender,
      reciverAccountNo: "0000000000",
      amount: 10,
    };

    jest
      .spyOn(mockWalletRepository, "findByUserId")
      .mockImplementation(() => Promise.resolve(tSenderWallet));
    jest
      .spyOn(mockWalletRepository, "findBy")
      .mockImplementation(() => Promise.resolve(tRecieverWallet));
    jest
      .spyOn(mockWalletRepository, "update")
      .mockImplementation(() => Promise.resolve(tRecieverWallet));
    // act
    const result = await transferUseCase.execute(
      tPayload.amount,
      tPayload.sender,
      tPayload.reciverAccountNo
    );
    // assert
    expect(result).toBeDefined();
    expect(result).toBe(true);
    expect(mockWalletRepository.findByUserId).toBeCalledTimes(1);
    expect(mockWalletRepository.findBy).toBeCalledTimes(1);
  });
  test("should throw error if sender wallet balance is less than amount to send", async () => {
    try {
      // arrange
      const tPayload = {
        sender: tSender,
        reciverAccountNo: "0000000000",
        amount: 100000,
      };
      jest
        .spyOn(mockWalletRepository, "findByUserId")
        .mockImplementation(() => Promise.resolve(tSenderWallet));
      jest
        .spyOn(mockWalletRepository, "findBy")
        .mockImplementation(() => Promise.resolve(tRecieverWallet));
      // act
      await transferUseCase.execute(
        tPayload.amount,
        tPayload.sender,
        tPayload.reciverAccountNo
      );
      //assert
      expect(mockWalletRepository.findByUserId).toBeCalledTimes(1);
      expect(mockWalletRepository.findBy).toBeCalledTimes(1);
    } catch (error) {
      // assert
      expect(error).toBeDefined();
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe(Errors.INSUFFICIENT_FUNDS);
    }
  });

  test("should throw error if sender wallet does not exist", async () => {
    try {
      // arrange
      const tPayload = {
        sender: tSender,
        reciverAccountNo: "0000000000",
        amount: 100,
      };
      jest
        .spyOn(mockWalletRepository, "findByUserId")
        .mockImplementation(() => Promise.resolve(null));
      // act
      await transferUseCase.execute(
        tPayload.amount,
        tPayload.sender,
        tPayload.reciverAccountNo
      );
      //assert
      expect(mockWalletRepository.findByUserId).toBeCalledTimes(1);
    } catch (error) {
      // assert
      expect(error).toBeDefined();
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe(Errors.SENDER_WALLET_NOT_FOUND);
    }
  });
  test("should throw error if reciever wallet does not exist", async () => {
    try {
      // arrange
      const tPayload = {
        sender: tSender,
        reciverAccountNo: "0000000000",
        amount: 10,
      };
      jest
        .spyOn(mockWalletRepository, "findByUserId")
        .mockImplementation(() => Promise.resolve(tSenderWallet));
      jest
        .spyOn(mockWalletRepository, "findBy")
        .mockImplementation(() => Promise.resolve(null));
      // act
      await transferUseCase.execute(
        tPayload.amount,
        tPayload.sender,
        tPayload.reciverAccountNo
      );
      //assert
      expect(mockWalletRepository.findByUserId).toBeCalledTimes(1);
      expect(mockWalletRepository.findBy).toBeCalledTimes(1);
    } catch (error) {
      // assert
      expect(error).toBeDefined();
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe(Errors.RECIEVER_WALLET_NOT_FOUND);
    }
  });
});
