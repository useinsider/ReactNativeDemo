import React from 'react';
import { Alert, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import renderer, { act } from 'react-test-renderer';

jest.mock('react-native-safe-area-context', () => ({
  __esModule: true,
  SafeAreaProvider: ({ children }: any) => children,
  SafeAreaView: ({ children }: any) => children,
  initialWindowMetrics: null,
}));

jest.mock('react-native-insider', () => ({
  __esModule: true,
  default: {
    appCards: {
      getCampaigns: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import Insider from 'react-native-insider';
import AppCards from '../src/insider/AppCards';
import { colors } from '../src/theme';

function makeCard(appCardId: string, isRead: boolean): any {
  return {
    appCardId,
    isRead,
    content: { title: `Title ${appCardId}`, description: `Body ${appCardId}` },
    images: [],
    buttons: [],
    action: null,
    markAsRead: jest.fn().mockResolvedValue(undefined),
    markAsUnread: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    view: jest.fn(),
    click: jest.fn(),
  };
}

async function renderInbox(cards: any[]): Promise<any> {
  (Insider as any).appCards.getCampaigns.mockResolvedValue({ appCards: cards });

  let component: any;
  await act(async () => {
    component = renderer.create(<AppCards />);
  });

  const openButton = component.root
    .findAllByType(TouchableHighlight)
    .find((node: any) => node.findAllByType(Text)[0]?.props.children === 'Show App Cards');

  await act(async () => {
    openButton.props.onPress();
  });

  return component.root;
}

function unreadIndicators(root: any): any[] {
  return root.findAllByType(View).filter((node: any) => {
    const style = StyleSheet.flatten(node.props.style);
    return !!style && style.width === 8 && style.height === 8 && style.borderRadius === 4;
  });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AppCardItem', () => {
  it('marks an unread card with the unread indicator', async () => {
    const root = await renderInbox([makeCard('unread-1', false)]);

    expect(unreadIndicators(root)).toHaveLength(1);
  });

  it('paints that indicator with the navy token', async () => {
    const root = await renderInbox([makeCard('unread-1', false)]);
    const style = StyleSheet.flatten(unreadIndicators(root)[0].props.style);

    expect(style.backgroundColor).toBe(colors.navy);
  });

  it('omits the unread indicator once the card is read', async () => {
    const root = await renderInbox([makeCard('read-1', true)]);

    expect(unreadIndicators(root)).toHaveLength(0);
  });
});

describe('AppCardItem Delete button', () => {
  it('paints the Delete button with the dark orange token', async () => {
    const root = await renderInbox([makeCard('unread-1', false)]);
    const deleteButton = root
      .findAllByType(TouchableHighlight)
      .find((node: any) => node.findAllByType(Text)[0]?.props.children === 'Delete');

    expect(deleteButton).toBeDefined();
    expect(StyleSheet.flatten(deleteButton.props.style).backgroundColor).toBe(colors.orangeDark);
  });
});

function touchableWithLabel(root: any, label: string): any[] {
  return root
    .findAllByType(TouchableHighlight)
    .filter((node: any) => node.findAllByType(Text)[0]?.props.children === label);
}

describe('AppCardItem read/unread toggle', () => {
  // The label and the method have to move together: a card showing "Mark Read" must call
  // markAsRead, not markAsUnread. Asserting only the label lets the two drift apart.
  it('marks an unread card as read', async () => {
    const card = makeCard('unread-1', false);
    const root = await renderInbox([card]);

    await act(async () => {
      touchableWithLabel(root, 'Mark Read')[0].props.onPress();
    });

    expect(card.markAsRead).toHaveBeenCalledTimes(1);
    expect(card.markAsUnread).not.toHaveBeenCalled();
  });

  it('marks a read card as unread', async () => {
    const card = makeCard('read-1', true);
    const root = await renderInbox([card]);

    await act(async () => {
      touchableWithLabel(root, 'Mark Unread')[0].props.onPress();
    });

    expect(card.markAsUnread).toHaveBeenCalledTimes(1);
    expect(card.markAsRead).not.toHaveBeenCalled();
  });

  it('refetches the list so the row reflects its new state', async () => {
    const card = makeCard('unread-1', false);
    const root = await renderInbox([card]);
    (Insider as any).appCards.getCampaigns.mockClear();

    await act(async () => {
      touchableWithLabel(root, 'Mark Read')[0].props.onPress();
    });

    expect((Insider as any).appCards.getCampaigns).toHaveBeenCalled();
  });
});

describe('AppCardItem Delete action', () => {
  // Delete is behind a confirmation, so the test has to answer it. Pressing the button alone must
  // NOT delete anything — that is half of what this covers.
  function confirmAlert(): void {
    const spy = jest.spyOn(Alert, 'alert');
    const buttons = spy.mock.calls[spy.mock.calls.length - 1][2] as any[];
    const destructive = buttons.find(button => button.style === 'destructive');

    expect(destructive).toBeDefined();
    destructive.onPress();
  }

  it('asks before deleting, and does not delete on the prompt alone', async () => {
    const card = makeCard('unread-1', false);
    const root = await renderInbox([card]);
    const spy = jest.spyOn(Alert, 'alert');

    await act(async () => {
      touchableWithLabel(root, 'Delete')[0].props.onPress();
    });

    expect(spy).toHaveBeenCalled();
    expect(card.delete).not.toHaveBeenCalled();
  });

  it('deletes the card and refetches the list once confirmed', async () => {
    const card = makeCard('unread-1', false);
    const root = await renderInbox([card]);
    (Insider as any).appCards.getCampaigns.mockClear();

    await act(async () => {
      touchableWithLabel(root, 'Delete')[0].props.onPress();
    });
    await act(async () => {
      confirmAlert();
    });

    expect(card.delete).toHaveBeenCalledTimes(1);
    expect((Insider as any).appCards.getCampaigns).toHaveBeenCalled();
  });
});
