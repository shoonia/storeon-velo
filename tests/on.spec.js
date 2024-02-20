import { randomUUID } from 'node:crypto';
import { jest } from '@jest/globals';
import { createStoreon } from '..';

describe('state.on()', () => {
  it('should unsubscribe event listener', () => {
    expect.hasAssertions();

    const event = randomUUID();
    const spy = jest.fn();

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
    expect(spy).toHaveBeenCalledWith({}, '1');
  });

  it('should not update state by async listener', () => {
    expect.hasAssertions();

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
