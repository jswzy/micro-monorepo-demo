import { onUnmounted, ref, type Ref } from 'vue'
import {
  getShared,
  setShared,
  subscribeShared,
  type SharedValue,
  type MicroAppSource,
} from '@demo/shared-utils'

export interface UseSharedStateReturn<T> {
  /** 响应式值，跨应用写入后会自动更新 */
  value: Ref<T>
  /** 写入并广播给其它子应用 */
  set: (value: T) => void
}

/**
 * 跨应用共享状态 —— Vue 响应式封装（逻辑下沉在 @demo/shared-utils 的 store.ts）
 *
 * 用法：
 *   const { value, set } = useSharedState('cross:customer', '')
 *   set('张三')            // 订单域写入
 *   // 商品域里同一份 key 的 value 会自动同步更新
 *
 * 底层经 wujie 共享 bus 广播，因此「运行时多个独立应用」之间也能共享值。
 */
export function useSharedState<T extends SharedValue>(
  key: string,
  initial: T,
  source: MicroAppSource = 'app-main',
): UseSharedStateReturn<T> {
  const value = ref(getShared<T>(key) ?? initial) as Ref<T>
  const stop = subscribeShared(key, (v) => {
    value.value = v as T
  })
  onUnmounted(stop)

  const set = (next: T) => {
    value.value = next
    setShared(key, next, source)
  }

  return { value, set }
}
