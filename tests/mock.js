global.$w = {
  onReady(cb) {
    setTimeout(cb, 5);
  },
};

jest.setTimeout(1000);
