require('./mock.js');
const { createStore } = require('../dist/index.js');

describe('@init event', () => {
  const init = () => createStore([
    (store) => {
      store.on('@init', () => ({ x: 5 }));
    },
  ]);

  it('getState() initial run', () => {
    const { getState } = init();

    expect(getState().x).toBe(5);
  });

  it('connect() initial run', (done) => {
    const { connect } = init();

    connect('x', ({ x }) => {
      expect(x).toBe(5);
      done();
    });
  });

  it('connectPage() initial run', (done) => {
    const { connectPage } = init();

    connectPage(({ x }) => {
      expect(x).toBe(5);
      done();
    });
  });
});
