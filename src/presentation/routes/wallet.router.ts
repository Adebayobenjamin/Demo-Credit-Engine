import { Router } from "express";
import { WalletController } from "../controllers/wallet.controller";
import { requiresAuth } from "../middlewares/auth";

export default function WalletRouter(walletController: WalletController) {
  const router = Router();
  router.get("/",requiresAuth, walletController.getWalletByUserId);
  router.post("/initiate-funding",requiresAuth, walletController.initiateFunding);
  router.post("/transfer",requiresAuth, walletController.transfer);
  router.post("/withdraw",requiresAuth, walletController.withdraw);
  router.post("/webhook/paystack", walletController.paymentWebhook);
  return router;
}
