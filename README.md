# vuex-strong-cache

Allow stronger chace for Vuex getters.

## What is this?

This library allows you to cache the result of function that returned by a getter. In other words, even if you write like the following getter, the final result will be cached as same as a normal getter result.

```js
getters: {
  getTodoById: (state, getters) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
```

## Installation

```sh
$ npm install --save vuex-strong-cache
# or
$ yarn add vuex-strong-cache
```

## Usage

vuex-strong-cache provides a helper function that can enhance getters. You can just wrap your getters by the `enhancedGetters` helper so that all your getters will ready to have stronger caching.

```js
import { enhancedGetters } from 'vuex-strong-cache'

export default {
  state: {
    todos: []
  },

  getters: enhancedGetters({
    getTodoById: (state, getters) => (id) => {
      return state.todos.find(todo => todo.id === id)
    }
  }),

  // ...
}
```

## License

MIT
