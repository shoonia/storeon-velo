import { jest } from '@jest/globals';
import { createStoreon } from '..';

describe('@init event', () => {
  it('should run @init event', () => {
    expect.hasAssertions();

    const { getState, readyStore } = createStoreon([
      (store) => {
        store.on('@init', () => ({ a: 0 }));
      },
    ]);

    readyStore();

    expect(getState()).toEqual({ a: 0 });
  });

  it('should run initial connect', (done) => {
    expect.hasAssertions();

    const { connect, readyStore } = createStoreon([
      (store) => {
        store.on('@init', () => ({ b: 1 }));
      },
    ]);

    connect('b', (state) => {
      expect(state).toEqual({ b: 1 });
      done();
    });

    readyStore();
  });

  it('should execute in the strict queue @init > @ready > connect', (done) => {
    expect.hasAssertions();

    const spy = jest.fn();

    const { connect, readyStore } = createStoreon([
      (store) => {
        store.on('@init', () => {
          spy();
          expect(spy).toHaveBeenCalledTimes(1);
          return { d: 3 };
        });

        store.on('@ready', () => {
          spy();
          expect(spy).toHaveBeenCalledTimes(2);
        });
      },
    ]);

    connect('d', () => {
      spy();
      expect(spy).toHaveBeenCalledTimes(3);
      done();
    });

    readyStore();
  });
});
