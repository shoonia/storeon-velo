'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

var createStore$1 = function (modules) {
  var store = storeon(modules);
  var subs = [];
  store.on('@changed', function (state, data) {
    subs.forEach(function (s) {
      if (s.key in data) {
        s.cb(state);
      }
    });
  });
  $w.onReady(function () {
    var state = store.get();
    subs.forEach(function (s) {
      s.cb(state);
    });
  });
  return {
    getState: store.get,
    dispatch: store.dispatch,
    connect: function (key, cb) {
      subs.push({ key: key, cb: cb });
      return function () {
        subs = subs.filter(function (s) {
          return s.cb !== cb;
        });
      };
    },
    connectPage: function (cb) {
      $w.onReady(function () {
        cb(store.get());
      });
    }
  };
};

exports.createStore = createStore$1;
