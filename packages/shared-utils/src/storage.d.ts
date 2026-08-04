/**
 * 带类型的 localStorage 封装
 * 微前端场景下基座与子应用同源共享 storage，统一走这里避免 key 冲突
 */
export declare const storage: {
    get<T>(key: string, fallback: T): T;
    set<T>(key: string, value: T): void;
    remove(key: string): void;
};
