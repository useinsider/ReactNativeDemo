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
  require('@react-native-async-storage/async-storage/jest'),
);

import React from 'react';
import App from '../App';
import Header from '../src/components/Header';
import PlaygroundConsole from '../src/components/PlaygroundConsole';
import InAppMethods from '../src/insider/InAppMethods';
import PushMethods from '../src/insider/PushMethods';
import Listeners from '../src/insider/Listeners';

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

// The section list is the only scrolling area; the header and the console stay
// pinned outside it.
function sectionScrollView(root: any): any {
  return root.findAllByProps({ contentInsetAdjustmentBehavior: 'automatic' })[0];
}

it('keeps the header out of the scrolling section list', () => {
  expect(sectionScrollView(renderApp()).findAllByType(Header)).toHaveLength(0);
});

it('keeps the Playground console out of the scrolling section list', () => {
  expect(sectionScrollView(renderApp()).findAllByType(PlaygroundConsole)).toHaveLength(0);
});

it('shows the header once at the top of the screen', () => {
  expect(renderApp().findAllByType(Header)).toHaveLength(1);
});

it('shows the In-App, Push and Listeners sections once each', () => {
  const root = renderApp();

  expect(root.findAllByType(InAppMethods)).toHaveLength(1);
  expect(root.findAllByType(PushMethods)).toHaveLength(1);
  expect(root.findAllByType(Listeners)).toHaveLength(1);
});

it('starts the SDK without enableIDFACollection and still applies the collection settings', async () => {
  const Insider = require('react-native-insider').default;
  jest.clearAllMocks();
  await act(async () => {
    renderer.create(<App />);
  });

  // The auto-stubbing SDK proxy also answers `calls`, which makes jest treat it as a jasmine
  // spy, so assert on the underlying mock records instead of the call matchers.
  expect(Insider.enableIDFACollection.mock.calls).toEqual([]);
  expect(Insider.enableIpCollection.mock.calls).toContainEqual([false]);
  expect(Insider.enableLocationCollection.mock.calls).toContainEqual([false]);
  expect(Insider.enableCarrierCollection.mock.calls).toContainEqual([false]);
  expect(Insider.setAllowsBackgroundLocationUpdates.mock.calls).toContainEqual([true]);
});
