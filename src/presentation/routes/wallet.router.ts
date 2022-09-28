import { Router } from "express";
import { WalletController } from "../controllers/wallet.controller";
import {
  initiateFundingDTO,
  initiateWithdrawalDTO,
  transferDTO,
  verifyAccountNumberDTO,
} from "../dto/wallet.dto";
import { requiresAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validator";

export default function WalletRouter(walletController: WalletController) {
  const router = Router();
  router.get("/", requiresAuth, walletController.getWalletByUserId);
  router.post(
    "/initiate-funding",
    requiresAuth,
    initiateFundingDTO(),
    validate,
    walletController.initiateFunding
  );
  router.post(
    "/transfer",
    requiresAuth,
    transferDTO(),
    validate,
    walletController.transfer
  );
  router.post("/withdraw", requiresAuth, walletController.withdraw);
  router.post("/webhook/paystack", walletController.paymentWebhook);
  router.get("/get-banks", walletController.getBanks);
  router.post(
    "/verify-account-number",
    verifyAccountNumberDTO(),
    validate,
    walletController.verifyAccountNumber
  );
  router.post(
    "/initiate-withdrawal",
    initiateWithdrawalDTO(),
    validate,
    requiresAuth,
    walletController.initiateWithdrawal
  );
  return router;
}
