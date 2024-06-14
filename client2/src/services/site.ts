import type { AxiosResponse } from "axios";
import { siteApi } from "./api";

interface SiteStatus {
    id:string;
    status:number;
}

export type SiteResponseStatus = AxiosResponse<SiteStatus>;

export interface SuccessResponse{
    status:boolean;
    message:string;
}



export const startSite = async ({id}:{id:string;}): Promise<SiteResponseStatus> => {
    // const token = (await authClient.getToken()).data;
  
    // if (token === null || token === undefined) {
    //   throw new Error('You must be logged in to perform this action');
    // }
    const data = {
        id,
    };
    const res = await siteApi.post('start/', data,{
      headers: {
        // Authorization: 'Bearer 123',
      },
    });
    return res;
};


export const deleteSite = async ({id}:{id:string;}): Promise<SiteResponseStatus> => {
    // const token = (await authClient.getToken()).data;
  
    // if (token === null || token === undefined) {
    //   throw new Error('You must be logged in to perform this action');
    // }
    const data = {
        id,
    };
    const res = await siteApi.post('delete/', data,{
      headers: {
        // Authorization: 'Bearer 123',
      },
    });
    return res;
};


export const stopSite = async ({id}:{id:string;}): Promise<SiteResponseStatus> => {
    // const token = (await authClient.getToken()).data;
  
    // if (token === null || token === undefined) {
    //   throw new Error('You must be logged in to perform this action');
    // }
    const data = {
        id,
    };
    const res = await siteApi.post('stop/', data,{
      headers: {
        // Authorization: 'Bearer 123',
      },
    });
    return res;
};