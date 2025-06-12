import axios from "axios";
import { HOST_API, HOST_SPRINGAI } from "../global-config";
import { commonStore } from "../store/reducers";
import { store } from "../store/config";

export const httpClient = axios.create({
  baseURL: HOST_API,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "en-US",
  },
});

export const springAiClient = axios.create({
  baseURL: HOST_SPRINGAI,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "en-US",
  },
});

httpClient.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    let errorMessage = "Uncategarized error occurred.";
    if (error.response) {
      const { status, data } = error.response;
      // console.log("Error response", error.response);
      switch (status) {
        case 400:
          errorMessage = data.message;
          break;
        case 401:
          errorMessage =
            data.message || "You are not authorized to access this resource.";
          break;
        case 403:
          errorMessage =
            data.message || "You are forbidden from accessing this resource.";
          break;
        case 404:
          errorMessage =
            data.message || "The resource you are looking for is not found.";
          break;
        case 500:
          errorMessage =
            data.message || "An error occurred while processing your request.";
          break;
        default:
          errorMessage = data.message;
      }
    } else if (error.request) {
      // NETWORK ERROR, DISCONNECTED TO SERVER
      errorMessage =
        "No response received from the server. Please check your network connection.";
    }

    store.dispatch(commonStore.actions.setErrorMessage(errorMessage));
    //return Promise.reject(error);
  }
);
