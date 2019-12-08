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

function createStore$1(modules) {
  const store = storeon(modules);
  let subscribe = [];
  store.on('@changed', (state, data) => {
    subscribe.forEach(({ property, callback }) => {
      if (property in data) {
        callback(state, data);
      }
    });
  });
  $w.onReady(() => {
    const state = store.get();
    subscribe.forEach(({ property, callback }) => {
      callback(state, { [property]: state[property] });
    });
  });
  return {
    getState: store.get,
    dispatch: store.dispatch,
    connect(property, callback) {
      subscribe.push({ property, callback });
      return () => {
        subscribe = subscribe.filter((listener) => listener.callback !== callback);
      };
    },
    connectPage(callback) {
      $w.onReady(() => {
        callback(store.get());
      });
    },
  };
}

export { createStore$1 as createStore };
