/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {installConsoleCapture} from './src/playground/playgroundLog';
import {name as appName} from './app.json';

// Mirror console output into the on-screen Playground console before App's
// import graph evaluates, so an import-time log is captured too. App is
// required rather than imported because imports are hoisted above this call.
installConsoleCapture();

const App = require('./App').default;

AppRegistry.registerComponent(appName, () => App);
