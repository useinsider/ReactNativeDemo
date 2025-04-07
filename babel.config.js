module.exports = function getBabelConfig(api) {
  api.cache(true)

  const plugins = []

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins,
  }
}