# storeon-velo

[![corvid-storeon test status](https://github.com/shoonia/storeon-velo/workflows/test/badge.svg)](https://github.com/shoonia/storeon-velo/actions)
[![npm version](https://badgen.net/npm/v/storeon-velo)](https://www.npmjs.com/package/storeon-velo)
[![minzip](https://badgen.net/bundlephobia/minzip/storeon-velo@latest)](https://bundlephobia.com/result?p=storeon-velo)

<a href="https://www.wix.com/alexanderz5/storeon-velo">
  <img src="https://static.wixstatic.com/shapes/e3b156_213b86a0c75b48e39d761768ffa6ac2b.svg"
    height="100" align="right" alt="Storeon Velo" crossorigin="anonymous"/>
</a>

A tiny event-based state manager [Storeon](https://github.com/storeon/storeon)
for [Velo](https://www.wix.com/velo) by Wix.

## How to use

You can install from Package Manager or use demo template.

- [Install](#install)
- Wix Website Template: [Open In Editor](https://editor.wix.com/html/editor/web/renderer/new?siteId=d6003ab4-7b91-4fe1-b65e-55ff3baca1f4&metaSiteId=654936ba-93bc-4f97-920a-c3050dd82fe7&autoDevMode=true)

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
import { getState, dispatch, connect, connectPage } from "public/store.js";

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

**[Live Demo](https://www.wix.com/alexanderz5/storeon-velo)**

## Install

You use the [Package Manager](https://support.wix.com/en/article/velo-working-with-npm-packages)
to manage the npm packages in your site.

Latest available version: v1.0.0 [Check status](https://www.wix.com/velo/npm-modules)

<img
  src="https://static.wixstatic.com/media/e3b156_5ae2f75f6f564611adb4dc8a2a53a661~mv2.jpg"
  width="500"
  alt="Package Manager panel in Wix editor, installing storeon-velo"
  crossorigin="anonymous"
/>

## Wix Website Template

Just open the template in the Wix Editor and play with `storeon-velo`

- [Open In Editor](https://editor.wix.com/html/editor/web/renderer/new?siteId=d6003ab4-7b91-4fe1-b65e-55ff3baca1f4&metaSiteId=654936ba-93bc-4f97-920a-c3050dd82fe7&autoDevMode=true)

## API

### createStoreon

Creates a store that holds the complete state tree of your app
and returns 4 methods for work with the app state. ([modules API](#store))

```js
const { getState, dispatch, connect, connectPage } = createStoreon(modules);
```

Syntax

```ts
function createStoreon(Array<Module | false>): Store

type Store = {
  getState: Function
  dispatch: Function
  connect: Function
  connectPage: Function
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
dispatch("event/type", { xyz: 123 });
```

Syntax

```ts
function dispatch(event: string, data?: any): void
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
function connect(...args: [key: string, ...key: string[], handler: ConnectHandler]): Disconnect

type ConnectHandler = (state: object) => void | Promise<void>

type Disconnect = () => void
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

type ReadyHandler = (state: object) => void | Promise<void>
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
  wixWindow.viewMode === "Preview" && logger,
]);
```

Syntax

```ts
function createStoreon(Array<Module | false>): Store

type Module = (store: StoreonStore) => void

type StoreonStore = {
  get: Function
  on: Function
  dispatch: Function
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
const off = store.on("event/type", (state, data) => { });

off();
```

Syntax

```ts
function on(event: string, listener: EventListener): Unbind

type EventListener = (state: object, data?: any) => Result

type Unbind = () => void

type Result = object | void | Promise<void> | false
```

#### store.dispatch

Emits an event with optional data.

```js
store.dispatch("event/type", { xyz: "abc" });
```

Syntax

```ts
function dispatch(event: string, data?: any): void
```

### Events

There are 4 built-in events:

#### `@init`

It will be fired in `createStoreon()`. The best moment to set an initial state.

```js
store.on("@init", () => { });
```

#### `@ready`

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
// "products": [] will be added to state on initialization
store.on("@init", () => {
  return { products: [] };
});
```

Event listener accepts the current state as a first argument
and optional event object as a second.

So event listeners can be a reducer as well.
As in Redux’s reducers, you should change immutable.

**Reducer**

```js
store.on("products/add", ({ products }, product) => {
  return {
    products: [...products, product],
  };
});
```

**Dispatch**

```js
$w("#buttonAdd").onClick(() => {
  dispatch("products/add", {
    _id: uuid(),
    name: $w("#inputName").value,
  });
});
```

**Connector**

```js
connect("products", ({ products }) => {
  $w("#repeater").data = products;
  $w("#repeater").forEachItem(($item, itemData) => {
    $item("#text").text = itemData.name;
  });
});
```

### Async operations

You can dispatch other events in event listeners. It can be useful for async operations.

```js
store.on("products/save", async (_, product) => {
  try {
    // wait until saving to database
    await wixData.save("Products",  product);

    // resolve
    store.dispatch("products/add", product);
  } catch (error) {
    // reject
    store.dispatch("errors/database", error);
  }
});
```

## License

[MIT](./LICENSE)
