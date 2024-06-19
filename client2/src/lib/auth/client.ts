'use client';

import { type ErrorResponse,type  TokenResponse, login, verify} from '@/services/auth';
import type { User } from '@/types/user';
import type { AxiosError, AxiosResponse } from 'axios';
import { logger } from '../default-logger';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

const user = {
  id: 'Admin-CCS',
  avatar: '/assets/ccs-bulb.png',
  firstName: 'Admin',
  lastName: 'CCS',
  email: 'ccs@thapar.edu',
} satisfies User;

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}


export interface SignInWithPasswordParams {
  username: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }


  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { username, password } = params;
    let token: string | null;
    try {
      const response = await login({ username, password });
      const successResponse = response as AxiosResponse<TokenResponse>;
      token = successResponse?.data?.access;
      logger.debug('signInWithPassword', response);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      logger.error('signInWithPassword', axiosError);

      if (axiosError?.response?.data?.detail) {
        return { error: axiosError?.response?.data?.message };
      }
      return { error: 'An error occurred' };
    }

    localStorage.setItem('custom-auth-token', token);
    return {};
  }



  
  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    try{
      const response = await verify();
      const successResponse = response;
      logger.debug('signInWithPassword', response);
      if(successResponse?.data?.status){
        return { data: user };
      }
    }
    catch(err){
      return { data: null };
    }
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    return { data: null };
  }

  async getToken(): Promise<{ data?: string | null }> {
    const token = localStorage.getItem('custom-auth-token');

    return { data: token };
  }


  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
