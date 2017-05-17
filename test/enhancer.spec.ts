import assert = require('power-assert')
import * as td from 'testdouble'
import Vue from 'vue'
import Vuex from 'vuex'
import { enhancedGetters } from '../src/enhancer'

describe('Enhanced Getters', () => {
  before(() => {
    Vue.use(Vuex)
  })

  it('should cache the result of function that returns getters', () => {
    const target = td.function()

    const store = new Vuex.Store({
      getters: enhancedGetters({
        test: () => target
      })
    })

    store.getters.test(1)
    store.getters.test(1)
    store.getters.test(2)

    td.verify(target(1), { times: 1 })
    td.verify(target(2), { times: 1 })

    store.getters.test(1)

    td.verify(target(1), { times: 2 })
  })

  it('should return correct value', () => {
    const target = td.function()

    td.when(target(1)).thenReturn(10)

    const store = new Vuex.Store({
      getters: enhancedGetters({
        test: () => target
      })
    })

    assert(store.getters.test(1) === 10)
  })

  it('should not touch non-function value', () => {
    const store = new Vuex.Store({
      state: {
        value: 10
      },

      getters: enhancedGetters<{ value: number }>({
        test: state => state.value * 2
      })
    })

    assert(store.getters.test === 20)

    store.state.value = 20

    assert(store.getters.test === 40)
  })

  it('should return fresh value even if argument object is mutated', () => {
    const store = new Vuex.Store({
      state: {
        value: 1
      },

      getters: enhancedGetters<{ value: number }>({
        test: state => (n: { value: number }) => {
          return state.value + n.value
        }
      })
    })

    const n = { value: 2 }
    assert(store.getters.test(n) === 3)
    n.value = 3
    assert(store.getters.test(n) === 4)
  })

  it('should clear the cache if state is updated', () => {
    const store = new Vuex.Store({
      state: {
        value: 1
      },
      getters: enhancedGetters<{ value: number }>({
        foo: state => (n: number) => {
          return state.value + n
        }
      })
    })

    assert(store.getters.foo(1) === 2)
    store.state.value = 10
    assert(store.getters.foo(1) === 11)
  })
})
