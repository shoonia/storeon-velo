import storeon from 'storeon/index.js';

export function createStore(modules) {
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
