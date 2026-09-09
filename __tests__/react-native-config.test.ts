const config = require('../react-native.config');

describe('react-native.config.js', () => {
  it('links the bundled font directory as an asset root', () => {
    expect(config.assets).toEqual(['./assets/fonts']);
  });
});
