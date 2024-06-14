import type { UseMutationResult } from "@tanstack/react-query";
import { useCustomMutation, type ResolutionFunctions } from "./use-custom-mutation";
import { deleteSite, startSite, stopSite } from "@/services/site";

export const useStartSite=({onSuccess,onError}:ResolutionFunctions):UseMutationResult=>{
return useCustomMutation({mutationFn:startSite, onSuccess, onError});
}
export const useStopSite=({onSuccess,onError}:ResolutionFunctions):UseMutationResult=>{
return useCustomMutation({mutationFn:stopSite, onSuccess, onError});
}
export const useDeleteSite=({onSuccess,onError}:ResolutionFunctions):UseMutationResult=>{
return useCustomMutation({mutationFn:deleteSite, onSuccess, onError});
}