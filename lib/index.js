let createStoreon$1 = modules => {
  let events = {};
  let state = {};

  let store = {
    dispatch(event, data) {
      if (event !== '@dispatch') {
        store.dispatch('@dispatch', [event, data, events[event]]);
      }

      if (events[event]) {
        let changes;
        events[event].forEach(i => {
          let diff = events[event].includes(i) && i(state, data, store);
          if (diff && typeof diff.then !== 'function') {
            state = { ...state, ...diff };
            changes = { ...changes, ...diff };
          }
        });
        if (changes) store.dispatch('@changed', changes);
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

let createStoreon = (modules) => {
  let store = createStoreon$1(modules);
  let SET_STATE = Symbol('@set-state');

  let page = [];
  let subs = [];

  store.on(SET_STATE, (_, data) => data);

  $w.onReady(() => {
    store.dispatch('@ready');

    store.on('@changed', (state, changes) => {
      subs.forEach((sub) => {
        let changesInKeys = sub.keys.some(
          (key) => key in changes,
        );

        if (changesInKeys) {
          sub.cb(state);
        }
      });
    });

    page.concat(subs).forEach((sub) => {
      sub.cb(store.get());
    });
  });

  return {
    dispatch: store.dispatch,
    getState: store.get,

    setState(data) {
      store.dispatch(SET_STATE, data);
    },

    connect(...keys) {
      let cb = keys.pop();

      subs.push({ keys, cb });

      return () => {
        subs = subs.filter((sub) => sub.cb !== cb);
      };
    },

    connectPage(cb) {
      page.push({ cb });
    },
  };
};

export { createStoreon };
