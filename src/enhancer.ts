import Vue from 'vue'
import { Getter, GetterTree } from 'vuex'

interface Cache {
  [key: string]: {
    args: any[],
    result: any
  }
}

interface CacheVue extends Vue {
  cache: Cache
}

export function enhancedGetters<S, R = any>(getters: GetterTree<S, R>): GetterTree<S, R> {
  const vm = new Vue({
    data: { cache: {} }
  }) as CacheVue

  Object.keys(getters).forEach(key => {
    getters[key] = wrapGetter(key, getters[key], vm.cache)
  })

  return getters
}

function wrapGetter<S, R>(name: string, getter: Getter<S, R>, cache: any): Getter<S, R> {
  return (state: S, getters: any, rootState: R, rootGetters: any) => {
    const res = getter(state, getters, rootState, rootGetters)

    if (typeof res === 'function') {
      if (!cache[name]) {
        Vue.set(cache, name, {
          args: null,
          result: null
        })
      }
      return wrapGetterResult(name, res, cache)
    } else {
      return res
    }
  }
}

function wrapGetterResult(name: string, fn: Function, cacheMap: any): Function {
  return (...args: any[]) => {
    const cache = cacheMap[name]

    if (cache.args && !isUpdated(cache.args, args)) {
      return cache.result
    }

    cache.args = args
    cache.result = fn(...args)

    return cache.result
  }
}

function isUpdated(xs: any[], ys: any[]): boolean {
  if (xs.length !== ys.length) return true

  return xs.reduce((acc, x, i) => {
    // Always mark object value as updated
    // because it can be mutated
    return acc || x !== ys[i] || typeof x === 'object'
  }, false)
}
