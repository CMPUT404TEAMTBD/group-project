import { AxiosResponse } from "axios";

// Helpers to check category of response code
export class ResponseHelper {
  static isSuccess = (res:AxiosResponse) => {
    return res.status >= 200 && res.status < 300;
  }

  static isRequestError = (res:AxiosResponse) => {
    return res.status >= 400 && res.status < 500;
  }

  static isServerError = (res:AxiosResponse) => {
    return res.status >= 500;
  }
}