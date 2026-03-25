const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)
config.projectRoot = __dirname

module.exports = withNativeWind(config, {
  input: path.join(__dirname, 'global.css'),
  // Prevent NativeWind from accidentally picking the repo-root Tailwind config
  // (web) which does not include the NativeWind preset.
  configPath: path.join(__dirname, 'tailwind.config.js'),
})
