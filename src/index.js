import storeon from 'storeon/index.js';

export var createStore = function (modules) {
  var store = storeon(modules);
  var page = [];
  var subs = [];

  store.on('@changed', function (state, data) {
    subs.forEach(function (s) {
      var changesInKeys = s.keys.some(function (key) {
        return key in data;
      });

      if (changesInKeys) {
        s.cb(state);
      }
    });
  });

  $w.onReady(function () {
    var state = store.get();

    page.concat(subs).forEach(function (s) {
      s.cb(state);
    });
  });

  return {
    getState: store.get,
    dispatch: store.dispatch,

    connect: function () {
      var l = arguments.length - 1;
      var cb = arguments[l];

      subs.push({
        keys: [].slice.call(arguments, 0, l),
        cb: cb
      });

      return function () {
        subs = subs.filter(function (s) {
          return s.cb !== cb;
        });
      };
    },

    connectPage: function (cb) {
      page.push({ cb: cb });
    }
  };
};
