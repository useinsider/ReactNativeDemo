import React from 'react';
import { act } from 'react-test-renderer';

const mockSubscription = { remove: jest.fn() };
jest.mock('react-native-insider', () => ({
  __esModule: true,
  default: {
    insiderIDListener: jest.fn(),
    events: { addObserver: jest.fn(() => mockSubscription) },
  },
}));

import Insider from 'react-native-insider';
import Listeners from '../src/insider/Listeners';
import { pressButton, render } from '../test-utils/buttons';

const sdk = Insider as any;

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

it('registers the Insider ID listener and logs the ID it receives', async () => {
  const component = await render(<Listeners />);
  await pressButton(component.root, 'Insider ID Listener');

  expect(sdk.insiderIDListener).toHaveBeenCalledWith(expect.any(Function));
  sdk.insiderIDListener.mock.calls[0][0]('insider-id-4');
  expect(console.log).toHaveBeenCalledWith('[INSIDER][insiderIDListener]: insider-id-4');
});

it('registers the Insider ID listener once however many times the button is pressed', async () => {
  const component = await render(<Listeners />);
  await pressButton(component.root, 'Insider ID Listener');
  await pressButton(component.root, 'Insider ID Listener');

  expect(sdk.insiderIDListener).toHaveBeenCalledTimes(1);
});

it('adds one event observer however many times the button is pressed', async () => {
  const component = await render(<Listeners />);
  await pressButton(component.root, 'Add Event Observer');
  await pressButton(component.root, 'Add Event Observer');

  expect(sdk.events.addObserver).toHaveBeenCalledTimes(1);
});

it('removes the observer and can subscribe again afterwards', async () => {
  const component = await render(<Listeners />);
  await pressButton(component.root, 'Add Event Observer');
  await pressButton(component.root, 'Remove Event Observer');
  await pressButton(component.root, 'Remove Event Observer');

  expect(mockSubscription.remove).toHaveBeenCalledTimes(1);

  await pressButton(component.root, 'Add Event Observer');
  expect(sdk.events.addObserver).toHaveBeenCalledTimes(2);
});

it('releases an active observer when the section unmounts', async () => {
  const component = await render(<Listeners />);
  await pressButton(component.root, 'Add Event Observer');

  await act(async () => {
    component.unmount();
  });

  expect(mockSubscription.remove).toHaveBeenCalledTimes(1);
});
