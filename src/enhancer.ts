import Vue from 'vue'
import { Getter, GetterTree } from 'vuex'

interface CacheEntry {
  args: any[]
  fn: Function
}

interface Cache {
  [key: string]: CacheEntry
}

interface CacheVm extends Vue {
  $data: {
    cache: Cache
  }
}

export function enhancedGetters<S, R = any>(getters: GetterTree<S, R>): GetterTree<S, R> {
  const vm = createCacheVm(getters)

  Object.keys(getters).forEach(key => {
    getters[key] = wrapGetter(key, getters[key], vm)
  })

  return getters
}

function wrapGetter<S, R>(name: string, getter: Getter<S, R>, vm: CacheVm): Getter<S, R> {
  return (state: S, getters: any, rootState: R, rootGetters: any) => {
    const res = getter(state, getters, rootState, rootGetters)

    if (typeof res === 'function') {
      if (!vm.$data.cache[name]) {
        Vue.set(vm.$data.cache, name, {
          args: null,
          fn: null
        })
      }
      const cache = vm.$data.cache[name]

      return (...args: any[]): any => {
        if (isUpdated(cache, args, res)) {
          cache.args = args
          cache.fn = res
        }
        return (vm as any)[name]
      }
    } else {
      return res
    }
  }
}

function isUpdated(cache: CacheEntry, args: any[], fn: Function): boolean {
  if (cache.fn !== fn) {
    return true
  }

  const oldArgs = cache.args

  if (!oldArgs || oldArgs.length !== args.length) return true

  return oldArgs.reduce((acc, old, i) => {
    return acc || old !== args[i]
  }, false)
}

function createCacheVm(getters: any): CacheVm {
  const getterTypes = Object.keys(getters)

  const options = {
    data: {
      cache: {}
    },
    computed: {}
  }
  getterTypes.forEach(type => {
    (options.computed as any)[type] = function(this: CacheVm): any {
      const cache = this.$data.cache[type]
      if (!cache) {
        return null
      } else {
        return cache.fn(...cache.args)
      }
    }
  })

  return new Vue(options) as CacheVm
}

function noop(): void {/* Do nothing */}
