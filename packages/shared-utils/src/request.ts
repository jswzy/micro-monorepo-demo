import { STORAGE_KEYS } from './constants'
import { storage } from './storage'
import type { ApiResponse } from './types'

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  /** query 参数 */
  params?: Record<string, string | number | boolean | undefined>
  /** JSON body */
  body?: unknown
  /** 超时(ms) */
  timeout?: number
}

export class RequestError extends Error {
  code: number
  constructor(message: string, code: number) {
    super(message)
    this.name = 'RequestError'
    this.code = code
  }
}

let baseURL = '/api'

/** 各子应用可在启动时覆盖自己的网关前缀 */
export function setBaseURL(url: string): void {
  baseURL = url
}

function buildURL(url: string, params?: RequestOptions['params']): string {
  const full = /^https?:\/\//.test(url) ? url : `${baseURL}${url}`
  if (!params) return full
  const search = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) search.append(k, String(v))
  })
  const qs = search.toString()
  return qs ? `${full}${full.includes('?') ? '&' : '?'}${qs}` : full
}

/** 统一请求：自动带 token、统一拆包、统一错误 */
export async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { params, body, timeout = 10_000, headers, ...rest } = options
  const token = storage.get<string>(STORAGE_KEYS.token, '')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const res = await fetch(buildURL(url, params), {
      ...rest,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })

    if (!res.ok) throw new RequestError(`HTTP ${res.status}`, res.status)

    const json = (await res.json()) as ApiResponse<T>
    if (json.code !== 0) throw new RequestError(json.message, json.code)
    return json.data
  } finally {
    clearTimeout(timer)
  }
}

export const http = {
  get: <T>(url: string, params?: RequestOptions['params'], options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'GET', params }),
  post: <T>(url: string, body?: unknown, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'POST', body }),
  put: <T>(url: string, body?: unknown, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'PUT', body }),
  delete: <T>(url: string, params?: RequestOptions['params'], options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'DELETE', params }),
}

/**
 * Demo 用：模拟接口延迟返回，方便无后端演示 loading 态
 */
export function mockRequest<T>(data: T, delay = 320): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay))
}
