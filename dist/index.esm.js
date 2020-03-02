var storeon = modules => {
  let events = { };
  let state = { };

  let store = {
    dispatch(event, data) {
      if (event !== '@dispatch') {
        store.dispatch('@dispatch', [event, data, events[event]]);
      }

      if (events[event]) {
        let changes = { };
        let changed;
        events[event].forEach(i => {
          let diff = i(state, data);
          if (diff && typeof diff.then !== 'function') {
            changed = state = { ...state, ...diff };
            changes = { ...changes, ...diff };
          }
        });
        if (changed) store.dispatch('@changed', changes);
      }
    },

    get: () => state,

    on(event, cb) {
      (events[event] || (events[event] = [])).push(cb);

      return () => {
        events[event] = events[event].filter(i => i !== cb);
      };
    }
  };

  modules.forEach(i => {
    if (i) i(store);
  });
  store.dispatch('@init');

  return store;
};

const createStore = (modules) => {
  const store = storeon(modules);
  const page = [];
  let subs = [];

  $w.onReady(() => {
    store.dispatch('@ready');

    store.on('@changed', (state, data) => {
      subs.forEach((s) => {
        const changesInKeys = s.keys.some((key) => key in data);

        if (changesInKeys) {
          s.cb(state);
        }
      });
    });

    page.concat(subs).forEach((s) => {
      s.cb(store.get());
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

export { createStore };
