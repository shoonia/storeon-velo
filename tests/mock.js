const delay = new Promise(resolve => setTimeout(resolve, 20));

global.$w = {
  onReady: Promise.prototype.then.bind(delay),
};

jest.setTimeout(1000);
