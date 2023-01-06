# Migrating to V4

`storeon-velo` is moving to `V4` with a few breaking changes.

## Required `readyStore()`

The store has removed auto initialization.

Your `connect()` callbacks must wait until all the page elements have finished loading. The previous versions of the library had subscribed to the [`$w.onReady()`](https://www.wix.com/velo/reference/$w/onready) event under the hood. [Here](https://github.com/shoonia/storeon-velo/blob/master/src/legacy.js#L45-L61)

Since `v4` you should use the new `readyStore()` API to add the observer to state changes. [Here](https://github.com/shoonia/storeon-velo/blob/master/src/index.js#L65-L78)

```diff
import { createStoreon } from 'storeon-velo';

const app = (store) => {...};

- const { getState, setState, dispatch, connect } = createStoreon([app]);
+ const { getState, setState, dispatch, connect, readyStore } = createStoreon([app]);

$w.onReady(() => {
+  return readyStore();
});
```

It must be used inside `$w.onReady()` method when all the page elements have finished loading

### Why?

With the new `readyStore()` API, we have the ability to control state observation to work with `connect()` callbacks.
For example, we can observe `connect()` callbacks only on the `'browser'` env and skip it on the `'backend'` env.

```js
$w.onReady(() => {
  if (wixWindow.rendering.env === 'browser') {
    return readyStore();
  }
});
```

Or we can ensure that some operation will be done before `connect()` callbacks run.

```js
$w.onReady(async () => {
  // fetch data
  const [posts, todos] = await Promise.all([
    getJSON('https://jsonplaceholder.typicode.com/posts'),
    getJSON('https://jsonplaceholder.typicode.com/todos'),
  ]);

  // Update state
  setState({ posts, todos });

  // Start to observe `connect()` callbacks
  return readyStore();
});
```

## Removed `connectPage()` method

The `connectPage()` API has been removed. If you need to run some callback once then you can use the `connect()` method with one argument.

```diff
- connectPage((state) => {
-   $w('#text1').text = state.title;
- });

+ const disconnect = connect((state) => {
+   $w('#text1').text = state.title;
+   disconnect();
+ });
```

It will be running once by `readyStore()` trigger. Also, I recommend using `disconnect()` API to remove callback from the subscription list. See the example below.

## Legacy APIs

If you need to work with legacy API, it available by path `'storeon-velo/legacy'`

```js
import { createStoreon } from 'storeon-velo/legacy';
```

- [New APIs docs](https://github.com/shoonia/storeon-velo/blob/master/README.md)
- [Legacy APIs docs](https://github.com/shoonia/storeon-velo/blob/master/docs/LEGACY.md)
