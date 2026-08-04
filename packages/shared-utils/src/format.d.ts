/** 金额格式化：分 -> ¥1,234.56 */
export declare function formatMoney(cents: number, currency?: string): string;
/** 日期格式化，支持 YYYY / MM / DD / HH / mm / ss */
export declare function formatDate(input: string | number | Date, pattern?: string): string;
/** 文本截断 */
export declare function truncate(text: string, max?: number): string;
/** 防抖 */
export declare function debounce<T extends (...args: never[]) => void>(fn: T, delay?: number): (...args: Parameters<T>) => void;
/** 生成带业务前缀的唯一 ID */
export declare function uniqueId(prefix?: string): string;
