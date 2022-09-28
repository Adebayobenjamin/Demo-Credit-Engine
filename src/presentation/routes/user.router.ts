import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { loginDTO, registerDTO } from "../dto/user.dto";
import { validate } from "../middlewares/validator";

export default function UserRouter(userController: UserController) {
  const router = Router();
  router.post("/register", registerDTO(), validate, userController.register);
  router.post("/login", loginDTO(), validate, userController.login);
  return router;
}
