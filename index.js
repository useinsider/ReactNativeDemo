/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {installConsoleCapture} from './src/playground/playgroundLog';
import App from './App';
import {name as appName} from './app.json';

// Mirror console output into the on-screen Playground console before any
// module logs, so SDK init output is captured too.
installConsoleCapture();

AppRegistry.registerComponent(appName, () => App);
