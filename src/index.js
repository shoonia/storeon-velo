import { createStoreon } from '../node_modules/storeon/index.js';

const createStore = (modules) => {
  const { dispatch, get, on } = createStoreon(modules);
  const page = [];
  let subs = [];

  $w.onReady(() => {
    dispatch('@ready');

    on('@changed', (state, changes) => {
      subs.forEach((s) => {
        const changesInKeys = s.keys.some((key) => key in changes);

        if (changesInKeys) {
          s.cb(state);
        }
      });
    });

    page.concat(subs).forEach((s) => {
      s.cb(get());
    });
  });

  return {
    getState: get,
    dispatch,

    connect(...keys) {
      const cb = keys.pop();

      subs.push({ keys, cb });

      return () => {
        subs = subs.filter((s) => s.cb !== cb);
      };
    },

    connectPage(cb) {
      page.push({ cb });
    },
  };
};

export {
  createStore,
  // Alias for backward compatibility between Storeon v1 and v2
  createStore as createStoreon,
};
