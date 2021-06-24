import { createStoreon as core } from 'storeon';

export let createStoreon = (modules) => {
  let state = core(modules);

  let page = [];
  let subs = [];

  $w.onReady(() => {
    state.dispatch('@ready');

    state.on('@changed', (state, changes) => {
      subs.forEach((sub) => {
        let changesInKeys = sub.keys.some(
          (key) => key in changes,
        );

        if (changesInKeys) {
          sub.cb(state);
        }
      });
    });

    page.concat(subs).forEach((sub) => {
      sub.cb(state.get());
    });
  });

  return {
    getState: state.get,
    dispatch: state.dispatch,

    connect() {
      let keys = [].slice.apply(arguments);
      let cb = keys.pop();

      subs.push({ keys, cb });

      return () => {
        subs = subs.filter((sub) => sub.cb !== cb);
      };
    },

    connectPage(cb) {
      page.push({ cb });
    },
  };
};
