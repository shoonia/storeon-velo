require('./mock.js');

const { createStoreon } = require('..');

describe('getState events', () => {
  it('should return the current state', () => {
    const event = '&event';

    const { dispatch, getState } = createStoreon([
      (store) => store.on(event, (_, x) => ({ x })),
    ]);

    expect(getState()).toEqual({});
    dispatch(event, 1);
    expect(getState()).toEqual({ x: 1 });
    dispatch(event, 2);
    expect(getState()).toEqual({ x: 2 });
  });
});
