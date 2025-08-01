# storeon-velo

[![https://wix.com/velo](https://img.shields.io/badge/Built%20for-Velo%20by%20Wix-3638f4)](https://wix.com/velo)
[![corvid-storeon test status](https://github.com/shoonia/storeon-velo/workflows/test/badge.svg)](https://github.com/shoonia/storeon-velo/actions)
[![npm version](https://badgen.net/npm/v/storeon-velo)](https://www.npmjs.com/package/storeon-velo)
[![minzip](https://badgen.net/bundlephobia/minzip/storeon-velo)](https://bundlephobia.com/package/storeon-velo)

A tiny event-based state manager [Storeon](https://github.com/storeon/storeon) for [Velo](https://www.wix.com/velo) by Wix.

![state manager storeon-velo](https://static.wixstatic.com/shapes/e3b156_87008db048c84222aa5f0814b5572677.svg)

## Example

```js
import { createStoreon } from 'storeon-velo';

const app = (store) => {
  store.on('@init', () => ({ count: 0 }));
  store.on('increment', ({ count }) => ({ count: count + 1 }));
};

const { getState, setState, dispatch, connect, readyStore } = createStoreon([app]);

// Subscribe for state property 'count'.
// The callback function will be run when the store is ready `readyStore()`
// and each time when property 'count' would change.
connect('count', ({ count }) => {
  $w('#text1').text = String(count);
});

$w.onReady(() => {
  $w('#button1').onClick(() => {
    // Emit event
    dispatch('increment');
  });

  // initialize observe of the state changes
  return readyStore();
});
```

## Install

### Velo

You use the [Package Manager](https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/packages/working-with-npm-packages)
to manage the npm packages in your Wix site.

### NPM/Yarn

```bash
npm install storeon-velo
#or
yarn add storeon-velo
```

## API

### createStoreon

Creates a store that holds the complete state tree of your app
and returns 5 methods for work with the app state. ([modules API](#store))

```js
const { getState, setState, dispatch, connect, readyStore } = createStoreon(modules);
```

Syntax

```ts
function createStoreon(Array<Module | false>): Store

type Store = {
  getState: Function
  setState: Function
  dispatch: Function
  connect: Function
  readyStore: Function
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

### setState

Set partial state. Accepts an object that will assign to the state.

```js
setState({ xyz: 123 });
```

Syntax

```ts
function setState(data: object): void
```

### dispatch

Emits an event with optional data.

```js
dispatch('event/type', { xyz: 123 });
```

Syntax

```ts
function dispatch(event: string, data?: any): void
```

### connect

Connects to state by property key.
It will return the function disconnect from the store.

```js
const disconnect = connect('key', (state) => { });

disconnect();
```

You can connect for multiple keys, the last argument must be a function.

```js
connect('key1', 'key2', (state) => { });
```

Syntax

```ts
function connect(...args: [key: string, ...key: string[], handler: ConnectHandler]): Disconnect

type ConnectHandler = (state: object) => void | Promise<void>

type Disconnect = () => void
```

### readyStore

Start to observe the state changes and calls of the `connect()` callbacks.
It must be used inside `$w.onReady()` when all the page elements have finished loading

```js
$w.onReady(() => {
  return readyStore();
});
```

Syntax

```ts
function readyStore(): Promise<any[]>
```

## Store

The store should be created with `createStoreon()` function.
It accepts a list of the modules.

Each module is just a function, which will accept a store and bind their event listeners.

```js
import { query } from 'wix-location-frontend';
import { createStoreon } from 'storeon-velo';

// Business logic
const appModule = (store) => {
  store.on('@init', () => {
    return {
      items: [],
    };
  });

  store.on('items/add', ({ items }, item) => {
    return {
      items: [...items, item],
    };
  });
};

// Devtools
export const logger = (store) => {
  store.on('@dispatch', (state, [event, data]) => {
    if (event === '@changed') {
      console.info(
        `%c @changed:%c ${Object.keys(data).join(', ')}\n`,
        'color:#25a55a;font-weight:bold;',
        'font-style:oblique;',
        state,
      );
    } else {
      console.info(
        `%c action:%c ${event}`,
        'color:#c161f0;font-weight:bold;',
        'color:#f69891;',
        typeof data !== 'undefined' ? data : '',
      );
    }
  });
};

const { getState, setState, dispatch, connect, readyStore } = createStoreon([
  appModule,
  // Enable development logger if a query param in the URL is ?logger=on
  query.logger === 'on' && logger,
]);

$w.onReady(() => {
  return readyStore();
});
```

Syntax

```ts
function createStoreon(Array<Module | false>): Store

type Module = (store: StoreonStore) => void

type StoreonStore = {
  dispatch: Function
  on: Function
  get: Function
  set: Function
}
```

### Storeon store methods

#### store.dispatch

Emits an event with optional data.

```js
store.dispatch('event/type', { xyz: 'abc' });
```

Syntax

```ts
function dispatch(event: string, data?: any): void
```

#### store.on

Adds an event listener. `store.on()` returns cleanup function.
This function will remove the event listener.

```js
const off = store.on('event/type', (state, data) => { });

off();
```

Syntax

```ts
function on(event: string, listener: EventListener): Unbind

type EventListener = (state: object, data?: any) => Result

type Unbind = () => void

type Result = object | void | Promise<void> | false
```

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

#### store.set

Set partial state. Accepts an object that will assign to the state.
it can be useful for async event listeners.

```js
store.set({ xyz: 123 });
```

Syntax

```ts
function set(data: object): void
```

### Events

There are 5 built-in events:

#### `@init`

It will be fired in `createStoreon()`. The best moment to set an initial state.

```js
store.on('@init', () => { });
```

#### `@ready`

It will be fired in `readyStore()` (it must be inside `$w.onReady()` when all the page elements have finished loading).

```js
store.on('@ready', (state) => { });
```

#### `@dispatch`

It will be fired on every new action (on `dispatch()` calls and `@changed` event).
It receives an array with the event name and the event’s data.
it can be useful for debugging.

```js
store.on('@dispatch', (state, [event, data]) => { });
```

#### `@set`

It will be fired when you use `setState()` or `store.set()` calls.

```js
store.on('@set', (state, changes) => { });
```

#### `@changed`

It will be fired when any event changes the state.
It receives object with state changes.

```js
store.on('@changed', (state, changes) => { });
```

You can dispatch any other events. Just do not start event names with `@`.

### Reducers

If the event listener returns an object, this object will update the state.
You do not need to return the whole state, return an object with changed keys.

```js
// 'products': [] will be added to state on initialization
store.on('@init', () => {
  return { products: [] };
});
```

Event listener accepts the current state as a first argument
and optional event object as a second.

So event listeners can be a reducer as well.
As in Redux’s reducers, you should change immutable.

**Reducer**

```js
store.on('products/add', ({ products }, product) => {
  return {
    products: [...products, product],
  };
});
```

**Dispatch**

```js
$w('#buttonAdd').onClick(() => {
  dispatch('products/add', {
    _id: uuid(),
    name: $w('#inputName').value,
  });
});
```

**Connector**

```js
connect('products', ({ products }) => {
  // Set new items to repeater
  $w('#repeater').data = products;
  // Update repeater items
  $w('#repeater').forEachItem(($item, itemData) => {
    $item('#text').text = itemData.name;
  });
});
```

### Async operations

You can dispatch other events in event listeners. It can be useful for async operations.

Also, you can use `store.set()` method for async listeners.

```js
import wixData from 'wix-data';
import { createStoreon } from 'storeon-velo';

const appModule = (store) => {
  store.on('@init', () => {
    return {
      products: [],
      error: null,
    };
  });

  store.on('@ready', async () => {
    try {
      // wait to fetch items from the database
      const { items } = await wixData.query('Products').find();

      // resolve
      store.set({ products: items });
    } catch (error) {
      // reject
      store.set({ error });
    }
  });

  // Listener with the logic of adding new items to list
  store.on('products/add', ({ products }, product) => {
    return {
      products: [product, ...products],
    };
  });

  store.on('products/save', async (_, product) => {
    try {
      // wait until saving to database
      await wixData.save('Products',  product);

      // resolve
      store.dispatch('products/add', product);
    } catch (error) {
      // reject
      store.set({ error });
    }
  });
}

const { getState, setState, dispatch, connect, readyStore } = createStoreon([
  appModule,
]);
```

### Work with Repeater

Use [`forEachItem()`](https://www.wix.com/velo/reference/$w/repeater/foreachitem) for updating a [$w.Repeater](https://www.wix.com/velo/reference/$w/repeater) items into `connect()` callback.

```js
connect('products', ({ products }) => {
  // Set new items to repeater
  $w('#repeater').data = products;
  // Update repeater items
  $w('#repeater').forEachItem(($item, itemData) => {
    $item('#text').text = itemData.name;
  });
});
```

Never nest the event handler for repeated items into any repeater loop.

Use global selector `$w()` instead and use [context](https://www.wix.com/velo/reference/$w/repeater/introduction#$w_repeater_introduction_retrieve-repeater-item-data-when-clicked) for retrieving repeater item data.

```diff
connect('products', ({ products }) => {
  $w('#repeater').data = products;

  $w('#repeater').forEachItem(($item, itemData) => {
    $item('#text').text = itemData.name;

-   $item('#repeatedContainer').onClick((event) => {
-     dispatch('cart/add', itemData);
-   });
  });
});

$w.onReady(() => {
+  $w('#repeatedContainer').onClick((event) => {
+    const { products } = getState();
+    const product = products.find((i) => i._id === event.context.itemId);
+
+    dispatch('cart/add', product);
+  });

  return readyStore();
});
```

**more:**

- [Event handling of Repeater Item](https://shoonia.site/event-handling-of-repeater-item)
- [The utils for repeated item scope event handlers](https://shoonia.site/the-utils-for-repeated-item-scope-event-handlers)

## License

[MIT](./LICENSE)
