describe('import', () => {
  it('should import createStoreon core', () => {
    const { createStoreon } = require('../dist');

    const { on, get, dispatch } = createStoreon([]);

    expect(typeof on === 'function').toBeTruthy();
    expect(typeof get === 'function').toBeTruthy();
    expect(typeof dispatch === 'function').toBeTruthy();
  });
});
