import { randomUUID } from 'node:crypto';
import { setTimeout } from 'node:timers/promises';
import { describe, it } from 'node:test';

import { expect } from './expect.js';
import { createStoreon } from '../src/index.js';

describe('@set event', () => {
  it('should update state', (t, done) => {
    const { getState, connect, readyStore } = createStoreon([
      (store) => {
        store.on('@init', () => ({ a: 0, b: 0 }));

        store.on('@ready', () => {
          store.set({ a: 5 });
        });
      },
    ]);

    connect((state) => {
      expect(state).toStrictEqual({ a: 5, b: 0 });
      expect(getState()).toStrictEqual({ a: 5, b: 0 });
      done();
    });

    readyStore();
  });

  it('should work with async handler', (t, done) => {
    const event = randomUUID();

    const { connect, dispatch, getState, readyStore } = createStoreon([
      (store) => {
        store.on('@init', () => ({ i: 10, p: null }));

        store.on(event, async () => {
          await setTimeout(5);
          store.set({ i: 5 });
        });
      },
    ]);

    readyStore();

    connect('i', (state) => {
      expect(state).toStrictEqual({ i: 5, p: null });
      expect(getState()).toStrictEqual({ i: 5, p: null });
      done();
    });

    dispatch(event);
  });

  it('should update the state with @set event', () => {
    const { dispatch, getState } = createStoreon([
      (store) => {
        store.on('@init', () => ({ x: 0, y: 0 }));
      },
    ]);

    dispatch('@set', { x: 9 });

    expect(getState()).toStrictEqual({ x: 9, y: 0 });
  });
});
