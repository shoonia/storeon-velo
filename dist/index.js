'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Initialize new store and apply all modules to the store.
 *
 * @param {moduleInitializer[]} modules Functions which will set initial state
 *                                      define reducer and subscribe
 *                                      to all system events.
 *
 * @return {Store} The new store.
 *
 * @example
 * import createStore from 'storeon'
 * let increment = store => {
 *   store.on('@init', () => ({ count: 0 }))
 *   store.on('inc', ({ count }) => ({ count: count + 1 }))
 * }
 * const store = createStore([increment])
 * store.get().count //=> 0
 * store.dispatch('inc')
 * store.get().count //=> 1
 */
var createStore = function (modules) {
  var events = { };
  var state = { };

  var on = function (event, cb) {
    (events[event] || (events[event] = [])).push(cb);

    return function () {
      events[event] = events[event].filter(function (i) {
        return i !== cb;
      });
    };
  };

  var dispatch = function (event, data) {
    if (event !== '@dispatch') {
      dispatch('@dispatch', [event, data, events[event]]);
    }

    if (events[event]) {
      var changes = { };
      var changed;
      events[event].forEach(function (i) {
        var diff = i(state, data);
        if (diff && typeof diff.then !== 'function') {
          changed = state = Object.assign({ }, state, diff);
          Object.assign(changes, diff);
        }
      });
      if (changed) dispatch('@changed', changes);
    }
  };

  var get = function () {
    return state;
  };

  var store = { dispatch: dispatch, get: get, on: on };

  modules.forEach(function (i) {
    if (i) i(store);
  });
  dispatch('@init');

  return store;
};

var storeon = createStore;

const createStore$1 = (modules) => {
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

exports.createStore = createStore$1;
