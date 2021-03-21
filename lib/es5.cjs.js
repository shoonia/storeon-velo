'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var createStoreon$1 = function createStoreon$1(modules) {
  var events = {};
  var state = {};
  var store = {
    dispatch: function dispatch(event, data) {
      if (event !== '@dispatch') {
        store.dispatch('@dispatch', [event, data, events[event]]);
      }

      if (events[event]) {
        var changes;
        events[event].forEach(function (i) {
          var diff = events[event].includes(i) && i(state, data, store);

          if (diff && typeof diff.then !== 'function') {
            state = Object.assign({}, state, diff);
            changes = Object.assign({}, changes, diff);
          }
        });
        if (changes) store.dispatch('@changed', changes);
      }
    },
    get: function get() {
      return state;
    },
    on: function on(event, cb) {
      (events[event] || (events[event] = [])).push(cb);
      return function () {
        events[event] = events[event].filter(function (i) {
          return i !== cb;
        });
      };
    }
  };
  modules.forEach(function (i) {
    if (i) i(store);
  });
  store.dispatch('@init');
  return store;
};

var createStoreon = function createStoreon(modules) {
  var _createStoreon$ = createStoreon$1(modules),
    dispatch = _createStoreon$.dispatch,
    get = _createStoreon$.get,
    on = _createStoreon$.on;

  var page = [];
  var subs = [];
  $w.onReady(function () {
    dispatch('@ready');
    on('@changed', function (state, changes) {
      subs.forEach(function (s) {
        var changesInKeys = s.keys.some(function (key) {
          return key in changes;
        });

        if (changesInKeys) {
          s.cb(state);
        }
      });
    });
    page.concat(subs).forEach(function (s) {
      s.cb(get());
    });
  });
  return {
    getState: get,
    dispatch: dispatch,
    connect: function connect() {
      var keys = [].slice.apply(arguments);
      var cb = keys.pop();
      subs.push({
        keys: keys,
        cb: cb
      });
      return function () {
        subs = subs.filter(function (s) {
          return s.cb !== cb;
        });
      };
    },
    connectPage: function connectPage(cb) {
      page.push({
        cb: cb
      });
    }
  };
};

exports.createStoreon = createStoreon;
