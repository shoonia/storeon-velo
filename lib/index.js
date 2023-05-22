let createStoreon = (modules) => {
  let events = {};
  let state = {};
  let subs = [];

  let dispatch = (event, data) => {
    if (event !== '@dispatch') {
      dispatch('@dispatch', [event, data]);
    }

    if (events[event]) {
      let changes;

      events[event].forEach((cb) => {
        let diff = cb(state, data);

        if (diff && typeof diff.then !== 'function') {
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
    (events[event] || (events[event] = [])).push(cb);

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

    connect(...keys) {
      let cb = keys.pop();

      subs.push({ keys, cb });

      return () => {
        subs = subs.filter((i) => i.cb !== cb);
      };
    },

    readyStore() {
      dispatch('@ready');

      on('@changed', (_, changes) => {
        subs.forEach((i) => {
          let hasChanges = i.keys.some((key) => key in changes);

          if (hasChanges) {
            i.cb(state);
          }
        });
      });

      return Promise.all(subs.map((i) => i.cb(state)));
    },
  };
};

export { createStoreon };
