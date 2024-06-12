import type { UseMutationResult } from "@tanstack/react-query";
import type { ResolutionFunctions} from "./use-custom-mutation";
import {  useCustomMutation } from "./use-custom-mutation";
import { siteAvailableStatus, uploadFileStatus } from "@/services/upload";




export const useSiteAvailable = ({onSuccess,onError}:ResolutionFunctions):UseMutationResult => {
    return useCustomMutation({mutationFn:siteAvailableStatus, onSuccess, onError})
}

export const useUpload = ({onSuccess,onError}:ResolutionFunctions):UseMutationResult => {
    return useCustomMutation({mutationFn:uploadFileStatus, onSuccess, onError})
}