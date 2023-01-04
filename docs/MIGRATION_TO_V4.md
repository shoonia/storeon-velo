# Migrating to v4

```diff
import { createStoreon } from 'storeon-velo';

const app = (store) => {...};

- const { getState, setState, dispatch, connect } = createStoreon([app]);
+ const { getState, setState, dispatch, connect, initStore } = createStoreon([app]);

+ $w.onReady(() => {
+   // initialize the store
+   return initStore();
+ });
```

```diff
import { createStoreon } from 'storeon-velo';

const app = (store) => {...};

- const { getState, setState, dispatch, connect, connectPage } = createStoreon([app]);
+ const { getState, setState, dispatch, connect, initStore } = createStoreon([app]);

- connectPage((state) => {
+ connect((state) => {
   $w('#repeatedContainer').text = state.title;
});
```
