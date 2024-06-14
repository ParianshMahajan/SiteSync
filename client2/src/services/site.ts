import type { AxiosResponse } from "axios";
import { siteApi } from "./api";

interface SiteStatus {
    id:string;
    status:number;
    fname:number;
}

export type SiteResponseStatus = AxiosResponse<SiteStatus>;

export interface SuccessResponse{
    status:boolean;
    message:string;
}



export const updateSite = async ({id,status}:SiteStatus): Promise<SiteResponseStatus> => {
    // const token = (await authClient.getToken()).data;
  
    // if (token === null || token === undefined) {
    //   throw new Error('You must be logged in to perform this action');
    // }
    const data = {
        id,
    };

    let backLink='not-found/';
    if (status === 0) {
        backLink = 'start/';
    } else if (status === 1) {
        backLink = 'stop/';
    } else if(status===-1) {
        backLink='delete/'
    }

    const res = await siteApi.post(backLink, data,{
      headers: {
        // Authorization: 'Bearer 123',
      },
    });
    return res;
};

export const renameSite = async ({id,fname}:SiteStatus): Promise<SiteResponseStatus> => {
    // const token = (await authClient.getToken()).data;
  
    // if (token === null || token === undefined) {
    //   throw new Error('You must be logged in to perform this action');
    // }
    const data = {
        id,
        fname,
    };


    const res = await siteApi.post('rename/', data,{
      headers: {
        // Authorization: 'Bearer 123',
      },
    });
    return res;
};
