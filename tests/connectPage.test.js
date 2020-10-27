require('./mock.js');
const { createStoreon } = require('../lib/cjs.js');

describe('connectPage', () => {
  it('Should getting an updated state by the queue.', (done) => {
    const callback = jest.fn();

    const { dispatch, connectPage } = createStoreon([
      (store) => {
        store.on('@init', () => ({ i: 0 }));
        store.on('inc', ({ i }) => {
          return { i: i + 1 };
        });
      },
    ]);

    connectPage((state) => {
      callback();
      expect(state).toEqual({ i: 0 });
      dispatch('inc');
    });
    connectPage((state) => {
      callback();
      expect(state).toEqual({ i: 1 });
      dispatch('inc');
    });
    connectPage((state) => {
      expect(state).toEqual({ i: 2 });
      expect(callback).toHaveBeenCalledTimes(2);
      done();
    });
  });
});
