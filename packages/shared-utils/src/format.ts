/** 金额格式化：分 -> ¥1,234.56 */
export function formatMoney(cents: number, currency = '¥'): string {
  const value = (cents / 100).toFixed(2)
  const [int, dec] = value.split('.')
  return `${currency}${int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${dec}`
}

/** 日期格式化，支持 YYYY / MM / DD / HH / mm / ss */
export function formatDate(input: string | number | Date, pattern = 'YYYY-MM-DD HH:mm'): string {
  const d = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(d.getTime())) return '-'
  const pad = (n: number) => String(n).padStart(2, '0')
  const map: Record<string, string> = {
    YYYY: String(d.getFullYear()),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds()),
  }
  return pattern.replace(/YYYY|MM|DD|HH|mm|ss/g, (key) => map[key] ?? key)
}

/** 文本截断 */
export function truncate(text: string, max = 20): string {
  return text.length > max ? `${text.slice(0, max)}…` : text
}

/** 防抖 */
export function debounce<T extends (...args: never[]) => void>(fn: T, delay = 300) {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/** 生成带业务前缀的唯一 ID */
export function uniqueId(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}
