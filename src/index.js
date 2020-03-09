import { createStoreon } from 'storeon/index.js';

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

    connect(...args) {
      const [cb] = args.slice(-1);

      subs.push({
        keys: args.slice(0, -1),
        cb
      });

      return () => {
        subs = subs.filter((s) => s.cb !== cb);
      };
    },

    connectPage(cb) {
      page.push({ cb });
    }
  };
};

export { createStoreon, createStore };
