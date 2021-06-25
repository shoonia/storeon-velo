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

  it('should equal to state in connectors', (done) => {
    const spy = jest.fn();

    const { connect, connectPage, getState } = createStoreon([
      (store) => {
        store.on('@init', () => ({ k: 10, g: '400' }));
      },
    ]);

    connectPage((state) => {
      spy();
      expect(getState()).toEqual(state);
    });

    connect('k', (state) => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(getState()).toEqual(state);
      done();
    });
  });
});
