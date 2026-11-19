import React from 'react';

jest.mock('react-native-insider/src/InsiderGender', () => require('../test-utils/insiderMocks').enumModule());

// Every user method records its call and returns the user, so the demo's setter chain runs.
const mockUserCalls: Array<[string, unknown[]]> = [];
const mockUser: any = new Proxy(
  {},
  {
    get: (_target, prop) => (...args: unknown[]) => {
      mockUserCalls.push([String(prop), args]);
      return mockUser;
    },
  },
);
jest.mock('react-native-insider', () => ({
  __esModule: true,
  default: { getCurrentUser: () => mockUser },
}));

import UserAttributes from '../src/insider/UserAttribute';
import { pressButton, render } from '../test-utils/buttons';

const OBJECTS_KEY = 'objects_parameter';

beforeEach(() => {
  mockUserCalls.length = 0;
});

async function press(label: string): Promise<void> {
  const component = await render(<UserAttributes />);
  await pressButton(component.root, label);
}

it('sets the email, phone, WhatsApp and promotional opt-in with the other attributes', async () => {
  await press('Set Attribute');

  expect(mockUserCalls).toEqual(
    expect.arrayContaining([
      ['setName', ['Insider']],
      ['setEmail', ['mobile.test@useinsider.com']],
      ['setPhoneNumber', ['+909876543210']],
      ['setWhatsappOptin', [true]],
      ['setPromotionalOptin', [true]],
    ]),
  );
});

it('adds objects to the custom attribute', async () => {
  await press('Add Objects');

  expect(mockUserCalls).toEqual([
    ['addObjectsToCustomAttribute', [OBJECTS_KEY, [{ id: 'item1', qty: 1 }, { id: 'item2', qty: 2 }]]],
  ]);
});

it('merges a value into the matching object', async () => {
  await press('Merge Objects');

  expect(mockUserCalls).toEqual([['mergeObjectsInCustomAttribute', [OBJECTS_KEY, { id: 'item1' }, { qty: 5 }]]]);
});

it('removes the matching objects', async () => {
  await press('Remove Objects');

  expect(mockUserCalls).toEqual([['removeObjectsFromCustomAttribute', [OBJECTS_KEY, { id: 'item2' }]]]);
});

it('unsets the attribute on its own, without needing an earlier add', async () => {
  await press('Unset Attribute');

  expect(mockUserCalls).toEqual([['unsetCustomAttribute', [OBJECTS_KEY]]]);
});
