require('./mock.js');

const { createStore } = require('../dist/index.js');

test('getState() initial run', () => {
  const { getState } = createStore([(s) => {
    s.on('@init', () => ({ x: 5 }));
  }]);

  expect(getState().x).toBe(5);
});

test('connect() initial run', (done) => {
  const { connect } = createStore([(s) => {
    s.on('@init', () => ({ y: 3 }));
  }]);

  connect('y', ({ y }) => {
    expect(y).toBe(3);
    done();
  });
});

test('connectPage() initial run', (done) => {
  const { connectPage } = createStore([(s) => {
    s.on('@init', () => ({ z: 'test' }));
  }]);

  connectPage(({ z }) => {
    expect(z).toBe('test');
    done();
  });
});
