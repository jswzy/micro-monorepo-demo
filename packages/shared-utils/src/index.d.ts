/**
 * @demo/shared-utils —— 业务域通用能力出口
 *
 * ⚠️ 边界约束：本包只服务于当前业务域（本仓库内的 app-*）。
 *    其他业务域需要复用，必须走 `pnpm changeset` 发布 npm 包后依赖，
 *    严禁跨仓库源码引用 / 相对路径穿透。
 */
export * from './types';
export * from './constants';
export * from './env';
export * from './format';
export * from './storage';
export * from './request';
export * from './event-bus';
export * from './micro';
export * from './mock';
export declare const SHARED_UTILS_VERSION = "0.1.0";
