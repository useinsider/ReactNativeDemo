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
});
