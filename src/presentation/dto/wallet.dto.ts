import { body } from "express-validator";

export const initiateFundingDTO = () => {
  return [body("amount").isFloat({ min: 10 })];
};

export const transferDTO = () => {
  return [
    body("amount").isFloat({ min: 10 }),
    body("recieverAccountNo").isString(),
  ];
};

export const initiateWithdrawalDTO = () => {
  return [
    body("amout").isFloat({ min: 10 }),
    body("accountName").isString(),
    body("accountNumber").isString(),
    body("bankCode").isString(),
  ];
};

export const fundWalletDTO = () => {
  return [body("amount").isFloat({ min: 10 })];
};

export const verifyAccountNumberDTO = () => {
  return [body("accountNumber").isString(), body("bankCode").isString()];
};
