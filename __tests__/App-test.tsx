/**
 * @format
 */

import 'react-native';


// The Insider SDK ships untranspiled ESM, which the react-native jest preset
// does not transform, so the whole SDK surface is stubbed for this suite.
jest.mock('react-native-insider', () => require('../test-utils/insiderMocks').sdkModule());

jest.mock('react-native-insider/src/ContentOptimizerDataType', () => require('../test-utils/insiderMocks').enumModule());

jest.mock('react-native-insider/src/InsiderCallbackType', () => require('../test-utils/insiderMocks').enumModule());

jest.mock('react-native-insider/src/InsiderGender', () => require('../test-utils/insiderMocks').enumModule());

jest.mock('react-native-insider/src/InsiderIdentifier', () => require('../test-utils/insiderMocks').enumModule());

jest.mock('react-native-safe-area-context', () => require('../test-utils/insiderMocks').safeAreaModule());

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import React from 'react';
import App from '../App';
import PlaygroundConsole from '../src/components/PlaygroundConsole';

// Note: test renderer must be required after react-native.
import renderer, { act } from 'react-test-renderer';

function renderApp(): any {
  let component: any;
  act(() => {
    component = renderer.create(<App />);
  });
  return component.root;
}

it('renders correctly', () => {
  renderer.create(<App />);
});

it('shows the Playground console above the sections', () => {
  expect(renderApp().findAllByType(PlaygroundConsole)).toHaveLength(1);
});
