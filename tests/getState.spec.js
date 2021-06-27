require('./mock.js');

const { createStoreon } = require('..');

describe('getState method', () => {
  it('should return the current state', () => {
    const event = '&event';

    const { dispatch, getState } = createStoreon([
      (store) => {
        store.on(event, (_, x) => ({ x }));
      },
    ]);

    expect(getState()).toEqual({});
    dispatch(event, 1);
    expect(getState()).toEqual({ x: 1 });
    dispatch(event, 2);
    expect(getState()).toEqual({ x: 2 });
  });

  it('should equal data in all methods', (done) => {
    const event = '!event';

    const { dispatch, getState } = createStoreon([
      (store) => {
        store.on('@init', () => ({ list: [1,2,3] }));

        store.on(event, (state) => {
          expect(getState()).toBe(state);
          expect(getState()).toBe(store.get());
          expect(getState()).toEqual({ list: [1,2,3] });
          done();
        });
      }
    ]);

    dispatch(event);
  });

  it('should equal to state with connect', (done) => {
    const { connect, getState } = createStoreon([
      (store) => {
        store.on('@init', () => ({ k: 10, g: '400' }));
      },
    ]);

    connect('k', (state) => {
      expect(getState()).toEqual(state);
      done();
    });
  });

  it('should equal to state with connectPage', (done) => {
    const { connectPage, getState } = createStoreon([
      (store) => {
        store.on('@init', () => ({ k: 20, g: '800' }));
      },
    ]);

    connectPage((state) => {
      expect(getState()).toEqual(state);
      done();
    });
  });
});
