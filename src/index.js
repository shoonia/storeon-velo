export let createStoreon = (modules) => {
  let events = Object.create(null);
  let state = {};
  let subs = [];

  let dispatch = (event, data) => {
    if ('@dispatch' !== event) {
      dispatch('@dispatch', [event, data]);
    }

    if (event in events) {
      let changes;

      events[event].forEach((cb) => {
        let diff = cb(state, data);

        if (diff && 'function' !== typeof diff.then) {
          state = { ...state, ...diff };
          changes = { ...changes, ...diff };
        }
      });

      if (changes) {
        dispatch('@changed', changes);
      }
    }
  };

  let on = (event, cb) => {
    (events[event] ??= []).push(cb);

    return () => {
      events[event] = events[event].filter((i) => i !== cb);
    };
  };

  let get = () => state;
  let set = (changes) => dispatch('@set', changes);

  on('@set', (_, changes) => changes);

  modules.forEach((mod) => {
    if (mod) {
      mod({ dispatch, on, get, set });
    }
  });

  dispatch('@init');

  return {
    dispatch,
    getState: get,
    setState: set,

    connect(...e) {
      let f = e.pop();

      subs.push({ e, f });

      return () => {
        subs = subs.filter((i) => i.f !== f);
      };
    },

    readyStore() {
      dispatch('@ready');

      on('@changed', (_, changes) => {
        subs.forEach((i) => {
          let hasChanges = i.e.some((key) => key in changes);

          if (hasChanges) {
            i.f(state);
          }
        });
      });

      return Promise.all(subs.map((i) => i.f(state)));
    },
  };
};
