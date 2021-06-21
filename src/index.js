import { createStoreon as core } from 'storeon';

export let createStoreon = (modules) => {
  let { dispatch, get, on } = core(modules);

  let page = [];
  let subs = [];

  $w.onReady(() => {
    dispatch('@ready');

    on('@changed', (state, changes) => {
      subs.forEach((s) => {
        let changesInKeys = s.keys.some((key) => key in changes);

        if (changesInKeys) {
          s.cb(state);
        }
      });
    });

    page.concat(subs).forEach((s) => {
      s.cb(get());
    });
  });

  return {
    getState: get,
    dispatch,

    connect() {
      let keys = [].slice.apply(arguments);
      let cb = keys.pop();

      subs.push({ keys, cb });

      return () => {
        subs = subs.filter((s) => s.cb !== cb);
      };
    },

    connectPage(cb) {
      page.push({ cb });
    },
  };
};
