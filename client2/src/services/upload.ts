import type { AxiosResponse } from "axios";
import { uploadApi } from "./api";

interface UploadStatus {
    status:boolean;
    site:string;
    message:string;
}

export type UploadResponseStatus = AxiosResponse<UploadStatus>;

interface UploadFileData {
    setUploadProgress: (progress: number) => void;
    totalSize: number;
    formData: FormData;
}

export interface SuccessResponse{
    status:boolean;
    message:string;
    site:string;
}


interface SiteAvailableData{
    name:string;
}

export const uploadFileStatus = async ({formData,setUploadProgress,totalSize}:UploadFileData): Promise<UploadResponseStatus> => {
    // const token = (await authClient.getToken()).data;
  
    // if (token === null || token === undefined) {
    //   throw new Error('You must be logged in to perform this action');
    // }
    const res = await uploadApi.post('/', formData,{
      headers: {
        "Content-Type": "multipart/form-data",
        // Authorization: 'Bearer 123',
      },
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / totalSize) * 100;
        setUploadProgress(progress);
      },
    });
    return res;
};

export const siteAvailableStatus = async ({name}:SiteAvailableData): Promise<UploadResponseStatus> => {
    // const token = (await authClient.getToken()).data;
  
    // if (token === null || token === undefined) {
    //   throw new Error('You must be logged in to perform this action');
    // }
    const data = {
        Name: name
    };
    const res = await uploadApi.post('isavailable/',data);
    return res;
};


export const replaceFile = async ({formData,setUploadProgress,totalSize}:UploadFileData): Promise<UploadResponseStatus> => {
    // const token = (await authClient.getToken()).data;
  
    // if (token === null || token === undefined) {
    //   throw new Error('You must be logged in to perform this action');
    // }
    const res = await uploadApi.post('replace/', formData,{
      headers: {
        "Content-Type": "multipart/form-data",
        // Authorization: 'Bearer 123',
      },
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / totalSize) * 100;
        setUploadProgress(progress);
      },
    });
    return res;
};
