/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { playgroundLog, uninstallConsoleCapture } from '../src/playground/playgroundLog';

// Logs while App's module body evaluates. The entry point requires App only
// after installConsoleCapture() runs, so this line must reach the store; a
// hoisted `import App from './App'` would evaluate it before the capture.
jest.mock('../App', () => {
  console.log('[INSIDER] module scope');
  return { default: () => null };
});

describe('index', () => {
  it('captures console output emitted while App evaluates', () => {
    jest.spyOn(AppRegistry, 'registerComponent').mockImplementation(() => 'ReactNativeDemo');
    playgroundLog.clear();

    try {
      require('../index');

      expect(playgroundLog.getLines()).toContain('[INSIDER] module scope');
    } finally {
      uninstallConsoleCapture();
    }
  });

  // A fresh registry is required because the entry point runs its registration
  // once, at module evaluation; the console patch the isolated copy installs is
  // bound to that copy, so it is undone by restoring the saved methods.
  it('registers the app component under the name from app.json', () => {
    const { name: appName } = require('../app.json');
    const saved = { log: console.log, warn: console.warn, error: console.error };

    try {
      jest.isolateModules(() => {
        const RN = require('react-native');
        const registerComponent = jest
          .spyOn(RN.AppRegistry, 'registerComponent')
          .mockImplementation(() => 'ReactNativeDemo');

        require('../index');

        expect(registerComponent).toHaveBeenCalledWith(appName, expect.any(Function));
      });
    } finally {
      Object.assign(console, saved);
    }
  });
});
