/*
 * @Author: ZhengJie
 * @Date: 2025-03-01 00:57:06
 * @LastEditTime: 2025-03-01 02:39:43
 * @Description: http
 */
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

export const createHttpClient = (baseURL: string, defaultHeaders = {}) => ({
  get: async <T>(endpoint: string, params?: Record<string, any>) => {
    const url = `${baseURL}${endpoint}`;
    const { data } = await firstValueFrom(
      new HttpService()
        .get<T>(url, { params: params, headers: defaultHeaders })
        .pipe(catchError(handleError)),
    );
    return data;
  },

  post: async <T>(endpoint: string, body: any) => {
    const url = `${baseURL}${endpoint}`;
    const { data } = await firstValueFrom(
      new HttpService()
        .post<T>(url, body, { headers: defaultHeaders })
        .pipe(catchError(handleError)),
    );
    return data;
  },
});

const handleError = (error: any) => {
  throw new Error(`HTTP 请求错误: ${error.response?.status || error.code}`);
};

export const WeixinApiHost = 'https://api.weixin.qq.com';

export const wxHttpClient = createHttpClient(WeixinApiHost);
