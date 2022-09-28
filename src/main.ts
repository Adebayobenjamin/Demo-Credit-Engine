import { config } from "dotenv";
import db, { syncronize } from "./core/config/db/knex";
import { CryptBox } from "./core/utils/cryptBox";
import ErrorHandler from "./core/utils/ErrorHandler";
import { UserDataSource } from "./data/dataSources/mysql/user.dataSource";
import { WalletDataSource } from "./data/dataSources/mysql/wallet.dataSource";
import {
  IUserDatabase,
  IWalletDatabase,
} from "./data/interfaces/dataSources/database";
import { UserRepository } from "./domain/repositories/user.repository";
import { LoginUseCase } from "./domain/useCases/user/login.useCase";
import { RegisterUseCase } from "./domain/useCases/user/register.useCase";
import { UserController } from "./presentation/controllers/user.controller";
import UserRouter from "./presentation/routes/user.router";
import server from "./server";
import * as uuid from "uuid";
import { WalletRepository } from "./domain/repositories/wallet.repository";
import { PayStackPaymentGateway } from "./data/dataSources/paymentGateway/paystack/paystack.paymentGateway";
import { CreateWalletUseCase } from "./domain/useCases/wallet/createWallet.useCase";
import { FundWalletUseCase } from "./domain/useCases/wallet/fundWallet.useCase";
import { GetWalletByUserIdUseCase } from "./domain/useCases/wallet/getWalletByUserId.useCase";
import { InitiateFundingUseCase } from "./domain/useCases/wallet/initiateFunding.useCase";
import { TransferUseCase } from "./domain/useCases/wallet/transfer.useCase";
import { WithdrawUseCase } from "./domain/useCases/wallet/withdraw.useCase";
import WalletRouter from "./presentation/routes/wallet.router";
import { WalletController } from "./presentation/controllers/wallet.controller";
import { GetUserByIdUseCase } from "./domain/useCases/user/getUserById.useCase";
import { requiresAuth } from "./presentation/middlewares/auth";
import { GetBanksUseCase } from "./domain/useCases/wallet/getBanks.useCase";
import { VerifyAccountNumberUseCase } from "./domain/useCases/wallet/verifyAccountNumber.useCase";
import { InitiateWithdrawalUseCase } from "./domain/useCases/wallet/initiateWithdrawal.useCase";
config();

(async () => {
  const userDatabase: IUserDatabase = {
    insertOne: async function (data): Promise<any> {
      data["id"] = uuid.v4();
      await db("user").insert(data, ["id", "email"]);
      const user = (
        await db("user").where({ id: data["id"] }).select("id", "email")
      )[0];
      return user;
    },
    findOne: async function <Type>(query: {}): Promise<any> {
      const result = await db("user").where(query).select();
      return result[0];
    },
    transaction: function (cb: (trx: any) => {}): Promise<any> {
      throw new Error("Function not implemented.");
    },
  };

  const walletDatabase: IWalletDatabase = {
    insertOne: function (data): Promise<any> {
      console.log(data);
      data["id"] = uuid.v4();
      data["balance"] = 0.0;
      const result = db("wallet").insert(data);
      return result;
    },
    findOne: async function <Type>(query: {}): Promise<any> {
      const result = await db("wallet")
        .innerJoin("user", "wallet.userId", "user.id")
        .where(query)
        .select(["wallet.id", "balance", "accountNo", "email"]);
      return result[0];
    },
    findById: async function <Type>(id: string): Promise<Type> {
      const result = await db("wallet").where({ id }).select();
      return result[0];
    },
    update: async function <Type>(data: any): Promise<any> {
      if (data["email"]) {
        delete data["email"];
      }
      console.log(data);
      const result = await db("wallet").where("id", data.id).update(data);
      // .where(data);
      console.log(result);
      return result;
    },
    transaction: function (cb: (trx: any) => {}): Promise<any> {
      throw new Error("Function not implemented.");
    },
  };

  const cryptBox = new CryptBox();
  const userDataSource = new UserDataSource(userDatabase);
  const userRepository = new UserRepository(userDataSource, cryptBox);
  const loginUseCase = new LoginUseCase(userRepository);
  const registerUseCase = new RegisterUseCase(userRepository);
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  const walletDataSource = new WalletDataSource(walletDatabase);
  const paymentGateway = new PayStackPaymentGateway();
  const walletRepository = new WalletRepository(
    walletDataSource,
    paymentGateway
  );
  const createWalletUseCase = new CreateWalletUseCase(walletRepository);
  const fundWalletUseCase = new FundWalletUseCase(walletRepository);
  const getWalletByUserIdUseCase = new GetWalletByUserIdUseCase(
    walletRepository
  );
  const initiateFundingUseCase = new InitiateFundingUseCase(walletRepository);
  const transferUseCase = new TransferUseCase(walletRepository);
  const withdrawUseCase = new WithdrawUseCase(walletRepository);
  const getBanksUseCase = new GetBanksUseCase(walletRepository);
  const verifyAccountNumberUseCase = new VerifyAccountNumberUseCase(
    walletRepository
  );
  const initiateWithdrawalUseCase = new InitiateWithdrawalUseCase(
    walletRepository
  );
  const walletController = new WalletController(
    fundWalletUseCase,
    getWalletByUserIdUseCase,
    initiateFundingUseCase,
    transferUseCase,
    withdrawUseCase,
    getUserByIdUseCase,
    getBanksUseCase,
    verifyAccountNumberUseCase,
    initiateWithdrawalUseCase
  );

  const userController = new UserController(
    loginUseCase,
    registerUseCase,
    createWalletUseCase
  );
  const userRouter = UserRouter(userController);
  const walletRouter = WalletRouter(walletController);

  server.use("/user", userRouter);
  server.use("/wallet", walletRouter);
  server.use(ErrorHandler);
  // const walletDataSource = new WalletDataSource
})();
const port = process.env.PORT;
server.listen(port, () => console.log("Server Running on Ports: ", port));
