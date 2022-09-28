import { config } from "dotenv";
import {
  InitiatePaymentPayload,
  IntailizatePaymentResponse,
  IPaymentGateway,
} from "../../../interfaces/dataSources/paymentGateway/paymentGateway";
import axios from "axios";
import { ResponseError } from "../../../../core/common/Response";
import crypto from "crypto";

config();
export class PayStackPaymentGateway implements IPaymentGateway {
  #baseUrl = "https://api.paystack.co";
  #privateKey = process.env.PAYSTACK_PRIVATE_KEY;
  async initiatePayment(
    payload: InitiatePaymentPayload
  ): Promise<IntailizatePaymentResponse> {
    try {
      console.log(payload);
      const response = await axios.post(
        `${this.#baseUrl}/transaction/initialize`,
        {
          amount: payload.amount * 100,
          email: payload.wallet["email"],
          callback_url: "https://lendsqr.com",
          metadata: {
            walletId: payload.wallet.id,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.#privateKey}`,
          },
        }
      );
      return {
        status: response.data.status,
        paymentUrl: response.data.data.authorization_url,
        paymentCode: response.data.data.access_code,
        reference: response.data.data.reference,
      };
    } catch (error) {
      throw new ResponseError({
        statusCode: 500,
        message:
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong with payment",
      });
    }
  }
  async withdrawFromBankAccount(payload: any): Promise<any> {
    try {
      // create Recipient
      const transferRecipient = await this.#createTransferRecipient(
        payload.account_name,
        payload.account_number,
        payload.bank_code
      );
      if (transferRecipient.status !== 200 && transferRecipient.status !== 201)
        throw new ResponseError({
          statusCode: 400,
          message: "transfer recipient not found",
        });
      // withdraw
      const transfer = await this.#initiateTransfer(
        payload.amount,
        transferRecipient.data.data.recipient_code
      );
    } catch (error) {
      throw new ResponseError({
        statusCode: 500,
        message: error.message ?? "Something went wrong with withdrawal",
      });
    }
  }
  verifyTransaction(payload: any): any {
    //validate event
    let isWithdrawal = false;
    const hash = crypto
      .createHmac("sha512", this.#privateKey)
      .update(JSON.stringify(payload.body))
      .digest("hex");
    if (hash == payload.signature) {
      isWithdrawal = payload.body.event == "transfer.success";
      return { status: true, isWithdrawal };
    }else{
      return {status: false}
    }
  }

  #createTransferRecipient(
    account_name: string,
    account_number: string,
    bank_code: string,
    currency = "NGN"
  ) {
    return axios.post(
      `${this.#baseUrl}/transferrecipient`,
      {
        name: account_name,
        account_number: account_number,
        bank_code: bank_code,
        currency: currency,
      },
      {
        headers: {
          Authorization: `Bearer ${this.#privateKey}`,
        },
      }
    );
  }

  #initiateTransfer(amount: number, recipient: string) {
    return axios.post(
      `${this.#baseUrl}/transfer`,
      {
        source: "balance",
        amount: amount * 100,
        recipient,
        reason: "withrawal",
      },
      {
        headers: {
          Authorization: `Bearer ${this.#privateKey}`,
        },
      }
    );
  }
}
