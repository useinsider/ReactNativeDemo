import React from 'react';

jest.mock('react-native-insider/src/InsiderIdentifier', () => require('../test-utils/insiderMocks').identifierModule());
jest.mock('react-native-insider/src/ContentOptimizerDataType', () => require('../test-utils/insiderMocks').enumModule());

const mockProduct = { id: 'example-product' };
jest.mock('react-native-insider', () => ({
  __esModule: true,
  default: {
    createNewProduct: () => mockProduct,
    itemAddedToWishlist: jest.fn(),
    itemRemovedFromWishlist: jest.fn(),
    wishlistCleared: jest.fn(),
    visitWishlistPage: jest.fn(),
    getMessageCenterDataWithIdentifiers: jest.fn(),
    markContentOptimizerAsSeen: jest.fn(),
  },
}));

import Insider from 'react-native-insider';
import ContentOptimizer from '../src/insider/ContentOptimizer';
import MessageCenter from '../src/insider/MessageCenter';
import PageVisitMethods from '../src/insider/PageVisit';
import Purchase from '../src/insider/Purchase';
import { pressButton, render } from '../test-utils/buttons';

const sdk = Insider as any;

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

async function press(element: React.ReactElement, label: string): Promise<void> {
  const component = await render(element);
  await pressButton(component.root, label);
}

it('adds the example product to the wishlist', async () => {
  await press(<Purchase />, 'Item Add To Wishlist');
  expect(sdk.itemAddedToWishlist).toHaveBeenCalledWith(mockProduct);
});

it('removes the product from the wishlist by ID', async () => {
  await press(<Purchase />, 'Item Remove From Wishlist');
  expect(sdk.itemRemovedFromWishlist).toHaveBeenCalledWith('productID');
});

it('clears the wishlist', async () => {
  await press(<Purchase />, 'Wishlist Clear');
  expect(sdk.wishlistCleared).toHaveBeenCalledTimes(1);
});

it('visits the wishlist page with two products', async () => {
  await press(<PageVisitMethods />, 'Wishlist Page');
  expect(sdk.visitWishlistPage).toHaveBeenCalledWith([mockProduct, mockProduct]);
});

it('reads Message Center data for the demo identifiers', async () => {
  await press(<MessageCenter />, 'Get Message Center Data With Identifiers');
  expect(sdk.getMessageCenterDataWithIdentifiers).toHaveBeenCalledWith(
    100,
    expect.any(Date),
    expect.any(Date),
    expect.objectContaining({
      identifiers: { email: 'mobile.test@useinsider.com', phoneNumber: '+909876543210', userID: '{crmID}' },
    }),
    expect.any(Function),
  );
});

it('marks the content optimizer variable as seen', async () => {
  await press(<ContentOptimizer />, 'Mark Content As Seen');
  expect(sdk.markContentOptimizerAsSeen).toHaveBeenCalledWith('string_variable_name');
});
