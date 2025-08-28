import { AxiosRequestConfig } from 'axios';
export interface ApiClientConfig {
    baseURL: string;
    timeout?: number;
    service: string;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    timestamp: number;
}
export interface ApiError {
    code: string;
    message: string;
    details?: any;
}
export declare class BaseApiClient {
    private client;
    private serviceName;
    constructor(config: ApiClientConfig);
    private setupInterceptors;
    private getAuthToken;
    private handleApiError;
    get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
    private extractData;
    setAuthToken(token: string): void;
    clearAuthToken(): void;
    healthCheck(): Promise<boolean>;
}
export declare const getApiConfig: (service: string) => ApiClientConfig;
export declare const createApiClient: (service: string) => BaseApiClient;
export declare const gatewayApi: BaseApiClient;
export declare const homeApi: BaseApiClient;
export declare const gameApi: BaseApiClient;
export declare const userApi: BaseApiClient;
export type { ApiClientConfig, ApiResponse, ApiError };
//# sourceMappingURL=apiClient.d.ts.map