# Migrating to V4

`storeon-velo`  is moving to `v4` with a few breaking changes.

## Required `readyStore()`

```diff
import { createStoreon } from 'storeon-velo';

const app = (store) => {...};

- const { getState, setState, dispatch, connect } = createStoreon([app]);
+ const { getState, setState, dispatch, connect, readyStore } = createStoreon([app]);

$w.onReady(() => {
+  return readyStore();
});
```

### Why?

```js
$w.onReady(() => {
  if (wixWindow.rendering.env === 'browser') {
    return readyStore();
  }
});
```

```js
$w.onReady(async () => {
  const [posts, todos] = await Promise.all([
    getJSON('https://jsonplaceholder.typicode.com/posts'),
    getJSON('https://jsonplaceholder.typicode.com/todos'),
  ]);

  setState({ posts, todos });

  return readyStore();
});
```

## Removed `connectPage()` method

```diff
- connectPage((state) => {
-   $w('#text1').text = state.title;
- });

+ const disconnect = connect((state) => {
+   $w('#text1').text = state.title;
+   disconnect();
+ });
```

## Legacy APIs

If you need to work with legacy API, it available by path `'storeon-velo/legacy'`

```js
import { createStoreon } from 'storeon-velo/legacy';
```

- [New APIs docs](https://github.com/shoonia/storeon-velo/blob/master/README.md)
- [Legacy APIs docs](https://github.com/shoonia/storeon-velo/blob/master/docs/LEGACY.md)
