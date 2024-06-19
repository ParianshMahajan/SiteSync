import type { AxiosResponse } from "axios";
import { adminApi } from "./api";
import { config } from "@/config";
import { authClient } from "@/lib/auth/client";

interface SiteStatus {
    query:string;
    filters:{isRunning:boolean,isStopped:boolean,isSearching:boolean};
    page:number;
}

export type SiteResponseStatus = AxiosResponse<SiteStatus>;

export interface Site{
    _id:string;
    SiteDNS:string;
    DNSId:string;
    fname:string;
    framework:string;
    fpath:string;
    Status:number;
        // 0->stopped
        // 1->running
}

export interface SuccessResponse{
    status:boolean;
    message:string;
    access:string;
    totalPages:number;
    sites:Site[];
}



export const searchSite = async ({query}:{query:string;}): Promise<SiteResponseStatus> => {
    const token = (await authClient.getToken()).data;
  
    if (token === null || token === undefined) {
      throw new Error('You must be logged in to perform this action');
    }
    const data = {
        query,
    };
    const res = await adminApi.post('searchsite/', data,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
};

export const fetchSites = async ({page,filters}:SiteStatus): Promise<SiteResponseStatus> => {
    const token = (await authClient.getToken()).data;
  
    if (token === null || token === undefined) {
      throw new Error('You must be logged in to perform this action');
    }
    const data = {
        page,
        pageSize:config.SitesPageSize,
        filters
    };
    const res = await adminApi.post('sites/',data,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return res;
};

export const updatePassword = async ({password}:{password:string;}): Promise<SiteResponseStatus> => {
    const token = (await authClient.getToken()).data;
  
    if (token === null || token === undefined) {
      throw new Error('You must be logged in to perform this action');
    }
    const data = {
        password
    };
    const res = await adminApi.post('update-password/',data,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return res;
};