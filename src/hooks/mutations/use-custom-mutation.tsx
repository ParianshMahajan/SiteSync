import type { ErrorResponse } from '@/services/auth';
import { useMutation } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import type { AxiosError, AxiosResponse } from 'axios';

export interface ResolutionFunctions {
  onSuccess?: (response: AxiosResponse) => void;
  onError?: (error: AxiosError<ErrorResponse>) => void;
}

export interface CustomMutationInterface extends ResolutionFunctions {
  mutationFn: MutationFunction;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- we do not need to know the types of arguments
type MutationFunction = (...args: any[]) => Promise<AxiosResponse>;

export const useCustomMutation = ({ mutationFn, onSuccess, onError }: CustomMutationInterface): UseMutationResult => {
  return useMutation({
    mutationFn,
    onSuccess,
    onError,
  });
};
