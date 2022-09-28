//  interface IResponse{
//     status: boolean;
//     error?: any;
//     data?: any;
// }

//  interface IResponseError{
//     statusCode: number;
//     message: string;
//     validationErrors: ValidationError[]
// }

//  interface IValidationError{
//     field: string;
//     message: string
// }

export class ResponseData {
  status: boolean;
  error?: any;
  data?: any;
  constructor({ status = true, error = null, data = null }) {
    this.status = status;
    this.error = error;
    this.data = data;
  }
}

export class ResponseError {
  statusCode: number;
  message: string;
  validationErrors: ValidationError[];
  constructor({ statusCode = 200, message = "", validationErrors = [] }) {
    this.statusCode = statusCode;
    this.message = message;
    this.validationErrors = validationErrors;
  }
}

export class ValidationError {
  field: string;
  message: string;
  constructor({ field = "", message = "" }) {
    this.field = field;
    this.message = message;
  }
}
