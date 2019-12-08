import storeon from 'storeon/index.js';

export var createStore = function (modules) {
  var store = storeon(modules);
  var subscribe = [];

  store.on('@changed', function (state, data) {
    subscribe.forEach(function (s) {
      if (s.key in data) {
        s.cb(state);
      }
    });
  });

  $w.onReady(function () {
    var state = store.get();

    subscribe.forEach(function (s) {
      s.cb(state);
    });
  });

  return {
    getState: store.get,
    dispatch: store.dispatch,

    connect: function (key, cb) {
      subscribe.push({ key: key, cb: cb });

      return function () {
        subscribe = subscribe.filter(function (s) {
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
