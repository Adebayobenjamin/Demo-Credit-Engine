import { NextFunction, Request, Response } from "express";
import { ResponseData } from "../../core/common/Response";
import { jwt } from "../../core/utils/jwt";
import { ILoginUseCase } from "../../domain/interfaces/useCases/user/login.useCase";
import { IRegisterUseCase } from "../../domain/interfaces/useCases/user/register.useCase";
import { ICreateWalletUseCase } from "../../domain/interfaces/useCases/wallet/createWallet.useCase";

export class UserController {
  loginUseCase: ILoginUseCase;
  registerUseCase: IRegisterUseCase;
  createWalletUseCase: ICreateWalletUseCase;

  constructor(
    loginUseCase: ILoginUseCase,
    registerUseCase: IRegisterUseCase,
    createWalletUseCase: ICreateWalletUseCase
  ) {
    this.loginUseCase = loginUseCase;
    this.registerUseCase = registerUseCase;
    this.createWalletUseCase = createWalletUseCase;
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.loginUseCase.execute(
        req.body.email,
        req.body.password
      );
      const token = jwt.createToken({ userId: user.id });
      res.status(200).json(
        new ResponseData({
          status: true,
          data: token,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.registerUseCase.execute(req.body);
      console.log(user)
      const wallet = await this.createWalletUseCase.execute({ userId: user.id });
      res.status(201).json(
        new ResponseData({
          status: true,
          data: user,
        })
      );
    } catch (error) {
      next(error);
    }
  };
}
