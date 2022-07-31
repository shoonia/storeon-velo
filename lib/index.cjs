'use strict';

let createStoreon = modules => {
  let events = {};
  let state = {};
  let page = [];
  let subs = [];

  let dispatch = (event, data) => {
    if (event !== '@dispatch') {
      dispatch('@dispatch', [event, data, events[event]]);
    }

    if (events[event]) {
      let changes;
      events[event].some(cb => {
        let diff = events[event].includes(cb) && cb(state, data);

        if (diff && typeof diff.then !== 'function') {
          state = { ...state,
            ...diff
          };
          changes = { ...changes,
            ...diff
          };
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
      events[event] = events[event].filter(i => i !== cb);
    };
  };

  let get = () => state;

  let set = changes => {
    dispatch('@set', changes);
  };

  on('@set', (_, changes) => changes);
  $w.onReady(() => {
    dispatch('@ready');
    on('@changed', (_, changes) => {
      subs.some(sub => {
        let changesInKeys = sub.keys.some(key => key in changes);

        if (changesInKeys) {
          sub.cb(state);
        }
      });
    });
    page.concat(subs).some(sub => {
      sub.cb(state);
    });
  });
  modules.some(mod => {
    if (mod) {
      mod({
        dispatch,
        on,
        get,
        set
      });
    }
  });
  dispatch('@init');
  return {
    dispatch,
    getState: get,
    setState: set,

    connect() {
      let keys = Array.from(arguments);
      let cb = keys.pop();
      subs.push({
        keys,
        cb
      });
      return () => {
        subs = subs.filter(sub => sub.cb !== cb);
      };
    },

    connectPage(cb) {
      page.push({
        cb
      });
    }

  };
};

exports.createStoreon = createStoreon;
