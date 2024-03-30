import { mock, describe, it } from 'node:test';

import { expect } from './expect.js';
import { createStoreon } from '../src/index.js';

describe('@init event', () => {
  it('should run @init event', () => {
    const { getState, readyStore } = createStoreon([
      (store) => {
        store.on('@init', () => ({ a: 0 }));
      },
    ]);

    readyStore();

    expect(getState()).toStrictEqual({ a: 0 });
  });

  it('should run initial connect', (t, done) => {
    const { connect, readyStore } = createStoreon([
      (store) => {
        store.on('@init', () => ({ b: 1 }));
      },
    ]);

    connect('b', (state) => {
      expect(state).toStrictEqual({ b: 1 });
      done();
    });

    readyStore();
  });

  it('should execute in the strict queue @init > @ready > connect', (t, done) => {
    const spy = mock.fn();

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
