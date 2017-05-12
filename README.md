# vuex-strong-cache

Allow stronger chace for Vuex getters.

## What is this?

This library allows you to cache the result of function that returns a getter. In other words, even if you write like the following example, the final result will be cached as same as a normal getter result.

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


## License

MIT
