require('./mock.js');

const { createStoreon } = require('..');

describe('dispatch method', () => {
  it('should call the event listener two times', () => {
    const event = '#event';
    const spy = jest.fn();

    const { dispatch } = createStoreon([
      (store) => store.on(event, spy),
    ]);

    dispatch(event);
    dispatch(event);

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should post the data to the event listener', () => {
    const event = '*event';
    const spy = jest.fn();

    const { dispatch } = createStoreon([
      (store) => store.on(event, (_, data) => spy(data)),
    ]);

    dispatch(event, { data: {} });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ data: {} });
  });
});
