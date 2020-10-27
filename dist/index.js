'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

let createStoreon = modules => {
  let events = {};
  let state = {};

  let store = {
    dispatch(event, data) {
      if (event !== '@dispatch') {
        store.dispatch('@dispatch', [event, data, events[event]]);
      }

      if (events[event]) {
        let changes = {};
        let changed;
        events[event].forEach(i => {
          let diff = events[event].includes(i) && i(state, data, store);
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

exports.createStore = createStore;
exports.createStoreon = createStore;
