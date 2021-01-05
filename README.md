# storeon-velo

[![corvid-storeon test status](https://github.com/shoonia/storeon-velo/workflows/test/badge.svg)](https://github.com/shoonia/storeon-velo/actions)
[![npm version](https://badgen.net/npm/v/storeon-velo)](https://www.npmjs.com/package/storeon-velo)
[![minzip](https://badgen.net/bundlephobia/minzip/storeon-velo@latest)](https://bundlephobia.com/result?p=storeon-velo)

A tiny event-based state manager [Storeon](https://github.com/storeon/storeon)
for [Velo](https://www.wix.com/velo) by Wix.

## Install

You use the [Package Manager](https://support.wix.com/en/article/velo-working-with-npm-packages)
to manage the npm packages in your site.

## Example

**`public/store.js`**

```js
import { createStoreon } from "storeon-velo";

const counter = (store) => {
  store.on("@init", () => ({ count: 0 }));
  store.on("increment", ({ count }) => ({ count: count + 1 }));
};

export const { getState, dispatch, connect, connectPage } = createStoreon([counter]);
```

**`Page Code`**

```js
import { dispatch, connect, connectPage } from "public/store.js";

// Subscribe for state property "count".
// The callback function will be run when the page loads ($w.onReady())
// and each time when property "count" would change.
connect("count", ({ count }) => {
  $w("#text1").text = String(count);
});

// Wrapper around $w.onReady()
// The callback function will be run once.
connectPage((state) => {
  $w("#button1").onClick(() => {
    // Emit event
    dispatch("increment");
  });
});
```

[Demo](https://www.wix.com/alexanderz5/corvid-storeon)

## API

### createStoreon

Creates a store that holds the complete state tree of your app
and returns 4 methods for work with the app state.

[Create store modules API](#store).

```js
const { getState, dispatch, connect, connectPage } = createStoreon(modules);
```

Syntax

```ts
function createStoreon(Array<Module | false>): Store

type Store = {
  getState: function
  dispatch: function
  connect: function
  connectPage: function
}
```

### getState

Returns an object that holds the complete state of your app.

```js
const state = getState();
```

Syntax

```ts
function getState(): object
```

### dispatch

Emits an event with optional data.

```js
dispatch("event/type", { value: 123 });
```

Syntax

```ts
function dispatch(event: string, [data: any]): void
```

### connect

Connects to state by property key.
It will return the function disconnect from the store.

```js
const disconnect = connect("key", (state) => { });

disconnect();
```

You can connect for multiple keys, the last argument must be a function.

```js
connect("key1", "key2", (state) => { });
```

Syntax

```ts
function connect(key: string, [key: string, ...], handler: ConnectHandler): Disconnect

callback ConnectHandler(state: object): void | Promise<void>

function Disconnect(): void
```

### connectPage

Sets the function that runs when all the page elements have finished loading.
(wrapper around `$w.onReady()`)

```js
connectPage((state) => { });
```

Syntax

```ts
function connectPage(initFunction: ReadyHandler): void

callback ReadyHandler(state: object): void | Promise<void>
```

## Store

The store should be created with `createStoreon()` function.
It accepts a list of the modules.

Each module is just a function, which will accept a store and bind their event listeners.

```js
import wixWindow from "wix-window";
import { createStoreon } from "storeon-velo";

// Business logic
const appModule = (store) => {
  store.on("@init", () => {
    return {
      items: [],
    };
  });

  store.on("items/add", ({ items }, item) => {
    return {
      items: [...items, item],
    };
  });
};

// Devtools
const logger = (store) => {
  store.on("@dispatch", (state, [event, data]) => {
    if (event === "@changed") {
      const keys = Object.keys(data).join(', ');
      console.log(`changed: ${keys}`, state);
    } else if (typeof data !== "undefined") {
      console.log(`action: ${event}`, data);
    } else {
      console.log(`action: ${event}`);
    }
  });
};

export const store = createStoreon([
  appModule,
  (wixWindow.viewMode === "Preview" && logger),
]);
```

Syntax

```ts
function createStoreon(Array<Module | false>): Store

function Module(store: StoreonStore): void

type StoreonStore = {
  get: function
  on: function
  dispatch: function
}
```

### Storeon store methods

#### store.get

Returns an object that holds the complete state of your app.
The app state is always an object.

```js
const state = store.get();
```

Syntax

```ts
function get(): object
```

#### store.on

Adds an event listener. `store.on()` returns cleanup function.
This function will remove the event listener.

```js
const unbind = store.on("event/type", (state, data) => { });

unbind();
```

Syntax

```ts
function on(event: string, listener: EventListener): Unbind

callback EventListener(state: object, [data: any]): Result

function Unbind(): void

type Result = object | void | Promise<void> | false
```

#### store.dispatch

Emits an event with optional data.

```js
store.dispatch("event/type", { value: "abc" });
```

Syntax

```ts
function dispatch(event: string, [data: any]): void
```

### Events

There are 4 built-in events:

#### `@init`

It will be fired in `createStoreon()`. The best moment to set an initial state.

```js
store.on("@init", () => { });
```

#### `@ready`

> Added in: v2.0.0

It will be fired in `$w.onReady()` when all the page elements have finished loading.

```js
store.on("@ready", (state) => { });
```

#### `@dispatch`

It will be fired on every new action (on `dispatch()` calls and `@changed` event).
It receives an array with the event name and the event’s data.
Can be useful for debugging.

```js
store.on("@dispatch", (state, [event, data]) => { });
```

#### `@changed`

It will be fired when any event changes the state.
It receives object with state changes.

```js
store.on("@changed", (state, changes) => { });
```

You can dispatch any other events. Just do not start event names with `@`.

### Reducers

If the event listener returns an object, this object will update the state.
You do not need to return the whole state, return an object with changed keys.

```js
// "products": {} will be added to state on initialization
store.on("@init", () => {
  return { products: { } };
});
```

Event listener accepts the current state as a first argument
and optional event object as a second.

So event listeners can be a reducer as well.
As in Redux’s reducers, you should change immutable.

```js
store.on("products/save", ({ products }, product) => {
  return {
    products: { ...products, [product._id]: product },
  };
});
```

```js
$w("#buttonAdd").onClick(() => {
  dispatch("products/save", {
    _id: uuid(),
    name: $w("#inputName").value,
  });
});
```

### Async operations

You can dispatch other events in event listeners. It can be useful for async operations.

```js
store.on("products/add", async (_, product) => {
  try {
    await wixData.save("Products",  product);

    store.dispatch("products/save", product);
  } catch (error) {
    store.dispatch("errors/database", error);
  }
});
```

## License

[MIT](./LICENSE)
