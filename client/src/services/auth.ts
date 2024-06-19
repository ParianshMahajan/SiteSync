// import type { AxiosResponse } from 'axios';

import type { AxiosResponse } from "axios";
import { adminApi } from "./api";
import { logger } from "@/lib/default-logger";

// import type { OkResponse } from './profile';

interface LoginData {
  username: string;
  password: string;
}


export interface TokenResponse {
  refresh: string;
  access: string;
}

export interface VerificationResponse {
  message: string;
  status:boolean;
}

export interface ErrorResponse {
  message: string;
  detail: string;
}

// interface InitiatePasswordResetData {
//   username: string;
// }


export type LoginResponse = TokenResponse | ErrorResponse;

export const login = async (data: LoginData): Promise<AxiosResponse<LoginResponse>> => {
  const res = await adminApi.post('/', data);
  logger.debug('login', res.data);
  return res;
};

export const verify = async (): Promise<AxiosResponse<VerificationResponse>> => {
  const token = localStorage.getItem('custom-auth-token');
  
  if (token === null || token === undefined) {
    throw new Error('You must be logged in to perform this action');
  }
  
  const res = await adminApi.get('/verify',{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  logger.debug('login', res.data);
  return res;
};


