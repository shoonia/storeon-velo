import storeon from 'storeon/index.js';

export const createStore = (modules) => {
  const store = storeon(modules);
  const page = [];
  let subs = [];

  store.on('@changed', (state, data) => {
    subs.forEach((s) => {
      const changesInKeys = s.keys.some((key) => key in data);

      if (changesInKeys) {
        s.cb(state);
      }
    });
  });

  $w.onReady(() => {
    const state = store.get();

    page.concat(subs).forEach((s) => {
      s.cb(state);
    });
  });

  return {
    getState: store.get,
    dispatch: store.dispatch,

    connect() {
      const l = arguments.length - 1;
      const cb = arguments[l];

      subs.push({
        keys: [].slice.call(arguments, 0, l),
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
