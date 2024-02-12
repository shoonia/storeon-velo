import { randomUUID } from 'node:crypto';
import { jest } from '@jest/globals';
import { createStoreon } from '..';

describe('dispatch method', () => {
  it('should call the event listener two times', () => {
    expect.hasAssertions();

    const spy = jest.fn();
    const event = randomUUID();

    const { dispatch } = createStoreon([
      (store) => {
        store.on(event, (state) => {
          spy(state);
        });
      },
    ]);

    dispatch(event);
    dispatch(event);

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should post the data to the event listener', () => {
    expect.hasAssertions();

    const event = randomUUID();
    const spy = jest.fn();

    const { dispatch } = createStoreon([
      (store) => {
        store.on(event, (_, data) => {
          spy(data);
        });
      },
    ]);

    dispatch(event, { data: {} });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ data: {} });
  });
});
