# corvid-storeon

[Storeon](https://github.com/storeon/storeon) for [Corvid](https://www.wix.com/corvid)

## How to use

**public/store.js**
```js
import { createStore } from "corvid-storeon";

const counter = (store) => {
  store.on("@init", () => ({ count: 0 }));
  store.on("inc", ({ count }) => ({ count: count + 1 }));
};

export const { getState, dispatch, connect, connectPage } = createStore([counter]);
```

**HOME PAGE**
```js
import { dispatch, connect, connectPage } from "public/store.js";

// Subscribe for state property "count".
// The callback function will be run when the page loads ($w.onReady)
// and each time when property "count" would change.
connect("count", ({ count }) => {
  $w("#text1").text = String(count);
});

// Wrapper around $w.onReady()
// The callback function will be run once time.
connectPage((state) => {
  $w("#button1").onClick(() => {
    // Dispatch action
    dispatch("inc");
  });
});
```

## License
[MIT](./LICENSE)
