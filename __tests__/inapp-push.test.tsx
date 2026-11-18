import React from 'react';
import { Platform } from 'react-native';

jest.mock('react-native-insider', () => ({
  __esModule: true,
  default: {
    closeButtonPosition: { LEFT: 'LEFT', RIGHT: 'RIGHT', NONE: 'NONE' },
    removeInapp: jest.fn(),
    showNativeAppReview: jest.fn(),
    setInternalBrowserCloseButtonPosition: jest.fn(),
    handleNotification: jest.fn(),
    triggerPushProcessWithNotificationData: jest.fn(),
    setHybridPushToken: jest.fn(),
    setForegroundPushCallback: jest.fn(),
  },
}));

import Insider from 'react-native-insider';
import InAppMethods from '../src/insider/InAppMethods';
import PushMethods, { SAMPLE_PUSH } from '../src/insider/PushMethods';
import { findButton, pressButton, render } from '../test-utils/buttons';

const sdk = Insider as any;

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.replaceProperty(Platform, 'OS', 'android');
});

afterEach(() => {
  jest.restoreAllMocks();
});

async function press(element: React.ReactElement, label: string): Promise<void> {
  const component = await render(element);
  await pressButton(component.root, label);
}

it('removes the in-app message on screen', async () => {
  await press(<InAppMethods />, 'Remove In-App');
  expect(sdk.removeInapp).toHaveBeenCalledTimes(1);
});

it('asks for the native app review', async () => {
  await press(<InAppMethods />, 'Show Native App Review');
  expect(sdk.showNativeAppReview).toHaveBeenCalledTimes(1);
});

it('moves the internal browser close button to the left', async () => {
  await press(<InAppMethods />, 'Close Button Left');
  expect(sdk.setInternalBrowserCloseButtonPosition).toHaveBeenCalledWith('LEFT');
});

it('hands the sample push to the SDK', async () => {
  await press(<PushMethods />, 'Handle Notification');
  expect(sdk.handleNotification).toHaveBeenCalledWith(SAMPLE_PUSH);
});

it('sends a rich push with an image and campaign ids', async () => {
  await press(<PushMethods />, 'Handle Notification');
  expect(sdk.handleNotification.mock.calls[0][0]).toMatchObject({
    source: 'Insider',
    image_url: expect.stringMatching(/^https:\/\//),
    camp_id: expect.any(String),
    camp_type: expect.any(String),
    variant_id: expect.any(String),
  });
});

it('triggers the push process with the sample push', async () => {
  await press(<PushMethods />, 'Trigger Push Process');
  expect(sdk.triggerPushProcessWithNotificationData).toHaveBeenCalledWith(SAMPLE_PUSH);
});

it('sets the hybrid push token', async () => {
  await press(<PushMethods />, 'Set Hybrid Push Token');
  expect(sdk.setHybridPushToken).toHaveBeenCalledWith('demo-hybrid-token');
});

it('registers a foreground push callback that logs the payload', async () => {
  await press(<PushMethods />, 'Set Foreground Push Callback');
  expect(sdk.setForegroundPushCallback).toHaveBeenCalledWith(expect.any(Function));

  sdk.setForegroundPushCallback.mock.calls[0][0]({ title: 'hi' });
  expect(console.log).toHaveBeenCalledWith('[INSIDER][foregroundPush]: ', { title: 'hi' });
});

it('hides the Android-only buttons on iOS', async () => {
  jest.replaceProperty(Platform, 'OS', 'ios');

  const inApp = await render(<InAppMethods />);
  const push = await render(<PushMethods />);

  expect(findButton(inApp.root, 'Close Button Left')).toBeUndefined();
  expect(findButton(push.root, 'Set Hybrid Push Token')).toBeUndefined();
  expect(findButton(push.root, 'Handle Notification')).toBeDefined();
});
