import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { get } from 'lodash';

export interface APIError {
  appName: string;
  code: string;
  data: any;
  message: string;
  status: number;
}

export interface RequestConfig<T> extends AxiosRequestConfig {
  data?: T;
}

const noResponseError = {
  message: 'Unexpected error occurred. Please try again.',
};

export const handleApiError = <R>(error: AxiosError): Promise<R> => {
  const apiError = get(error, 'response.data.error', noResponseError);
  return Promise.reject(apiError);
};

export const request = <R>(config: any): Promise<R | APIError> =>
  axios
    .request(config)
    .then((res) => res.data as R)
    .catch((error) => handleApiError<R>(error));
