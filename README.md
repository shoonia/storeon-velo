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

const { getState, setState, dispatch, connect, initStore } = createStoreon([app]);

// Subscribe for state property 'count'.
// The callback function will be run when the store is initialized `initState()`
// and each time when property 'count' would change.
connect('count', ({ count }) => {
  $w('#text1').text = String(count);
});

$w.onReady(() => {
  $w('#button1').onClick(() => {
    // Emit event
    dispatch('increment');
  });

  // initialize the store
  return initStore();
});
```

## Install

You use the [Package Manager](https://support.wix.com/en/article/velo-working-with-npm-packages)
to manage the npm packages in your site.

[Check latest available version](https://www.wix.com/velo/npm-modules)

![Package Manager panel in Wix editor, installing storeon-velo](https://static.wixstatic.com/media/e3b156_89e4871c048b48538242a7568b7ed2de~mv2.jpg)

## License

[MIT](./LICENSE)
