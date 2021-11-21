var createStoreon$1 = function createStoreon(modules) {
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
  var store = createStoreon$1(modules);
  var page = [];
  var subs = [];
  store.on('@set', function (_, data) {
    return data;
  });
  $w.onReady(function () {
    store.dispatch('@ready');
    store.on('@changed', function (state, changes) {
      subs.forEach(function (sub) {
        var changesInKeys = sub.keys.some(function (key) {
          return key in changes;
        });

        if (changesInKeys) {
          sub.cb(state);
        }
      });
    });
    page.concat(subs).forEach(function (sub) {
      sub.cb(store.get());
    });
  });
  return {
    dispatch: store.dispatch,
    getState: store.get,
    setState: function setState(data) {
      store.dispatch('@set', data);
    },
    connect: function connect() {
      var keys = [].slice.apply(arguments);
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

export { createStoreon };
