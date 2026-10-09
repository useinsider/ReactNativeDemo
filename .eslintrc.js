module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      files: ['test-utils/**/*.js'],
      env: { jest: true },
    },
  ],
};
