import axios from 'axios';

export const url = 'http://localhost:2123/';
// export const url = 'http://apisitesync.pariansh.tech/';

export const authApi = axios.create({
  baseURL: url,
});

export const uploadApi = axios.create({
  baseURL: `${url}upload/`,
});

export const siteApi = axios.create({
  baseURL: `${url}site/`,
});

export const adminApi = axios.create({
  baseURL: `${url}/`,
});

