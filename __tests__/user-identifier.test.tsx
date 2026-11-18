import React from 'react';

jest.mock('react-native-insider/src/InsiderIdentifier', () => require('../test-utils/insiderMocks').identifierModule());

const mockUser = {
  login: jest.fn(),
  logout: jest.fn(),
  logoutResettingInsiderID: jest.fn(),
};
const mockGetInsiderID = jest.fn();
jest.mock('react-native-insider', () => ({
  __esModule: true,
  default: {
    getCurrentUser: () => mockUser,
    getInsiderID: () => mockGetInsiderID(),
    signUpConfirmation: jest.fn(),
  },
}));

import UserIdentifiers from '../src/insider/UserIdentifier';
import { pressButton, render } from '../test-utils/buttons';

let log: jest.SpyInstance;

beforeEach(() => {
  jest.clearAllMocks();
  log = jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  log.mockRestore();
});

async function press(label: string): Promise<void> {
  const component = await render(<UserIdentifiers />);
  await pressButton(component.root, label);
}

const EXPECTED_IDENTIFIERS = {
  identifiers: { email: 'mobile.test@useinsider.com', phoneNumber: '+909876543210', userID: '{crmID}' },
};

it('logs in with a returning-ID callback and logs the ID it receives', async () => {
  await press('Login With Returning ID');

  expect(mockUser.login).toHaveBeenCalledWith(expect.objectContaining(EXPECTED_IDENTIFIERS), expect.any(Function));
  mockUser.login.mock.calls[0][1]('insider-id-1');
  expect(log).toHaveBeenCalledWith('[INSIDER][loginWithReturningID]: insider-id-1');
});

it('logs out resetting the Insider ID and logs the new ID', async () => {
  await press('Logout Resetting ID');

  expect(mockUser.logoutResettingInsiderID).toHaveBeenCalledWith(null, expect.any(Function));
  mockUser.logoutResettingInsiderID.mock.calls[0][1]('insider-id-2');
  expect(log).toHaveBeenCalledWith('[INSIDER][logoutResettingInsiderID]: insider-id-2');
});

it('logs the Insider ID it reads', async () => {
  mockGetInsiderID.mockResolvedValue('insider-id-3');

  await press('Get Insider ID');

  expect(mockGetInsiderID).toHaveBeenCalledTimes(1);
  expect(log).toHaveBeenCalledWith('[INSIDER][getInsiderID]: insider-id-3');
});

it('logs the error message when reading the Insider ID fails', async () => {
  mockGetInsiderID.mockRejectedValue(new Error('boom'));

  await press('Get Insider ID');

  expect(log).toHaveBeenCalledWith('[INSIDER][getInsiderID]: failed: boom');
});
