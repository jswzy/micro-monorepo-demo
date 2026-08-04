/**
 * 带类型的 localStorage 封装
 * 微前端场景下基座与子应用同源共享 storage，统一走这里避免 key 冲突
 */
export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = window.localStorage.getItem(key)
      return raw === null ? fallback : (JSON.parse(raw) as T)
    } catch {
      return fallback
    }
  },

  set<T>(key: string, value: T): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.warn('[shared-utils] storage.set failed:', err)
    }
  },

  remove(key: string): void {
    window.localStorage.removeItem(key)
  },
}
