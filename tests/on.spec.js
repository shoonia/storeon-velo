import { randomUUID } from 'node:crypto';
import { describe, it, mock } from 'node:test';

import { expect } from './expect.js';
import { createStoreon } from '../src/index.js';

describe('state.on()', () => {
  it('should unsubscribe event listener', () => {
    const event = randomUUID();
    const spy = mock.fn();

    /** @type {Function} */
    let off;

    const { dispatch } = createStoreon([
      (store) => {
        off = store.on(event, spy);
      },
    ]);

    dispatch(event, '1');
    off();
    dispatch(event, '2');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith({}, '1');
  });

  it('should not update state by async listener', () => {
    const event = randomUUID();

    const { dispatch, getState } = createStoreon([
      (store) => {
        store.on(event, async () => ({ x: 1 }));
      },
    ]);

    dispatch(event);
    expect(getState()).toStrictEqual({});
  });
});
