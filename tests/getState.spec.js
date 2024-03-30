import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';

import { expect } from './expect.js';
import { createStoreon } from '../src/index.js';

describe('getState method', () => {
  it('should return the current state', () => {
    const event = randomUUID();

    const { dispatch, getState } = createStoreon([
      (store) => {
        store.on(event, (_, x) => ({ x }));
      },
    ]);

    expect(getState()).toStrictEqual({});
    dispatch(event, 1);
    expect(getState()).toStrictEqual({ x: 1 });
    dispatch(event, 2);
    expect(getState()).toStrictEqual({ x: 2 });
  });

  it('should equal data in all methods', (t, done) => {
    const event = randomUUID();

    const { dispatch, getState, readyStore } = createStoreon([
      (store) => {
        store.on('@init', () => ({ list: [1,2,3] }));

        store.on(event, (state) => {
          expect(getState()).toBe(state);
          expect(getState()).toBe(store.get());
          expect(getState()).toStrictEqual({ list: [1,2,3] });
          done();
        });
      }
    ]);

    readyStore();
    dispatch(event);
  });

  it('should equal to state with connect', (t, done) => {
    const { connect, getState, readyStore } = createStoreon([
      (store) => {
        store.on('@init', () => ({ k: 10, g: '400' }));
      },
    ]);

    connect('k', (state) => {
      expect(getState()).toBe(state);
      expect(getState()).toStrictEqual({ k: 10, g: '400' });
      done();
    });

    readyStore();
  });
});
