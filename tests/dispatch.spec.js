import { randomUUID } from 'node:crypto';
import { describe, it, mock } from 'node:test';

import { expect } from './expect.js';
import { createStoreon } from '../src/index.js';

describe('dispatch method', () => {
  it('should call the event listener two times', () => {
    const spy = mock.fn();
    const event = randomUUID();

    const { dispatch } = createStoreon([
      (store) => {
        store.on(event, spy);
      },
    ]);

    dispatch(event, 1);
    dispatch(event, 2);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, {}, 1);
    expect(spy).toHaveBeenNthCalledWith(2, {}, 2);
  });

  it('should post the data to the event listener', () => {
    const event = randomUUID();
    const spy = mock.fn();

    const { dispatch } = createStoreon([
      (store) => {
        store.on(event, spy);
      },
    ]);

    dispatch(event, { data: {} });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith({}, { data: {} });
  });
});
