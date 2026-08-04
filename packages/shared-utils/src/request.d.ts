export interface RequestOptions extends Omit<RequestInit, 'body'> {
    /** query 参数 */
    params?: Record<string, string | number | boolean | undefined>;
    /** JSON body */
    body?: unknown;
    /** 超时(ms) */
    timeout?: number;
}
export declare class RequestError extends Error {
    code: number;
    constructor(message: string, code: number);
}
/** 各子应用可在启动时覆盖自己的网关前缀 */
export declare function setBaseURL(url: string): void;
/** 统一请求：自动带 token、统一拆包、统一错误 */
export declare function request<T>(url: string, options?: RequestOptions): Promise<T>;
export declare const http: {
    get: <T>(url: string, params?: RequestOptions["params"], options?: RequestOptions) => Promise<T>;
    post: <T>(url: string, body?: unknown, options?: RequestOptions) => Promise<T>;
    put: <T>(url: string, body?: unknown, options?: RequestOptions) => Promise<T>;
    delete: <T>(url: string, params?: RequestOptions["params"], options?: RequestOptions) => Promise<T>;
};
/**
 * Demo 用：模拟接口延迟返回，方便无后端演示 loading 态
 */
export declare function mockRequest<T>(data: T, delay?: number): Promise<T>;
