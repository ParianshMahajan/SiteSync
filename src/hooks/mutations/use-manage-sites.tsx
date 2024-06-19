import type { UseMutationResult } from "@tanstack/react-query";
import { useCustomMutation, type ResolutionFunctions } from "./use-custom-mutation";
import { fetchSites, searchSite, updatePassword } from "@/services/manage-sites";

export const useSearch=({onSuccess,onError}:ResolutionFunctions):UseMutationResult=>{
    return useCustomMutation({mutationFn:searchSite, onSuccess, onError})
}

export const useFetchSites=({onSuccess,onError}:ResolutionFunctions):UseMutationResult=>{
    return useCustomMutation({mutationFn:fetchSites, onSuccess, onError})
}

export const useUpdatePassword=({onSuccess,onError}:ResolutionFunctions):UseMutationResult=>{
    return useCustomMutation({mutationFn:updatePassword, onSuccess, onError})
}