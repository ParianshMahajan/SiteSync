import type { UseMutationResult } from "@tanstack/react-query";
import { useCustomMutation, type ResolutionFunctions } from "./use-custom-mutation";
import { renameSite, updateSite } from "@/services/site";

export const useUpdateSite=({onSuccess,onError}:ResolutionFunctions):UseMutationResult=>{
return useCustomMutation({mutationFn:updateSite, onSuccess, onError});
}

export const useRenameSite=({onSuccess,onError}:ResolutionFunctions):UseMutationResult=>{
return useCustomMutation({mutationFn:renameSite, onSuccess, onError});
}