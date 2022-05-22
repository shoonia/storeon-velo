'use strict';

var createStoreon = function createStoreon(modules) {
  var events = {};
  var state = {};
  var page = [];
  var subs = [];

  var dispatch = function dispatch(event, data) {
    if (event !== '@dispatch') {
      dispatch('@dispatch', [event, data, events[event]]);
    }

    if (events[event]) {
      var changes;
      events[event].some(function (cb) {
        var diff = events[event].includes(cb) && cb(state, data);

        if (diff && typeof diff.then !== 'function') {
          state = Object.assign({}, state, diff);
          changes = Object.assign({}, changes, diff);
        }
      });

      if (changes) {
        dispatch('@changed', changes);
      }
    }
  };

  var on = function on(event, cb) {
    (events[event] || (events[event] = [])).push(cb);
    return function () {
      events[event] = events[event].filter(function (i) {
        return i !== cb;
      });
    };
  };

  var get = function get() {
    return state;
  };

  var set = function set(changes) {
    dispatch('@set', changes);
  };

  on('@set', function (_, changes) {
    return changes;
  });
  $w.onReady(function () {
    dispatch('@ready');
    on('@changed', function (_, changes) {
      subs.some(function (sub) {
        var changesInKeys = sub.keys.some(function (key) {
          return key in changes;
        });

        if (changesInKeys) {
          sub.cb(state);
        }
      });
    });
    page.concat(subs).some(function (sub) {
      sub.cb(state);
    });
  });
  modules.some(function (mod) {
    if (mod) {
      mod({
        dispatch: dispatch,
        on: on,
        get: get,
        set: set
      });
    }
  });
  dispatch('@init');
  return {
    dispatch: dispatch,
    getState: get,
    setState: set,
    connect: function connect() {
      var keys = Array.from(arguments);
      var cb = keys.pop();
      subs.push({
        keys: keys,
        cb: cb
      });
      return function () {
        subs = subs.filter(function (sub) {
          return sub.cb !== cb;
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
