import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export default function UserRouter(userController: UserController) {
  const router = Router();
  router.post("/register", userController.register);
  router.post("/login", userController.login);
  return router;
}
