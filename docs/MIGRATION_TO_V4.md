# Migrating to V4

## `initStore()`

```diff
import { createStoreon } from 'storeon-velo';

const app = (store) => {...};

- const { getState, setState, dispatch, connect } = createStoreon([app]);
+ const { getState, setState, dispatch, connect, initStore } = createStoreon([app]);

$w.onReady(() => {
+  return initStore();
});
```

## Removed `connectPage()` method

```diff
import { createStoreon } from 'storeon-velo';

const app = (store) => {...};

- const { getState, setState, dispatch, connect, connectPage } = createStoreon([app]);
+ const { getState, setState, dispatch, connect, initStore } = createStoreon([app]);

- connectPage((state) => {
+ connect((state) => {
   $w('#text1').text = state.title;
});
```

## Legacy APIs

```js
import { createStoreon } from 'storeon-velo/legacy';
```

- [Legacy APIs docs](https://github.com/shoonia/storeon-velo/blob/master/docs/LEGACY.md)
- [New APIs docs](https://github.com/shoonia/storeon-velo/blob/master/README.md)
