import { body } from "express-validator";

export const loginDTO = () => {
  return [body("email").isEmail(), body("password").isLength({ min: 8 })];
};

export const registerDTO = () => {
  return [body("email").isEmail(), body("password").isLength({ min: 8 })];
};

