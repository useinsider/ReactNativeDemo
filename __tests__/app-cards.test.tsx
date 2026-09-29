import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import renderer, { act } from 'react-test-renderer';

jest.mock('react-native-safe-area-context', () => require('../test-utils/insiderMocks').safeAreaModule());

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

function makeCard(id: string, isRead: boolean): any {
  return {
    id,
    isRead,
    content: { title: `Title ${id}`, description: `Body ${id}` },
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
  // Found by identity, not by size: a selector that re-states the dot's geometry stops matching
  // the moment the dot is resized, and then `toHaveLength(0)` passes whether the guard works or not.
  return root.findAllByProps({ testID: 'unread-indicator' }).filter(
    (node: any) => node.type === View,
  );
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

  it('draws that indicator as an 8pt circle', async () => {
    const root = await renderInbox([makeCard('unread-1', false)]);
    const style = StyleSheet.flatten(unreadIndicators(root)[0].props.style);

    // The selector used to match on these numbers, which made it the only thing asserting them.
    // Now that it matches on testID, the geometry needs its own assertion or a square dot ships.
    expect(style.width).toBe(8);
    expect(style.height).toBe(8);
    expect(style.borderRadius).toBe(4);
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
  //
  // Each test installs its own spy BEFORE pressing: reading the calls off a spy created afterwards
  // only works while a sibling test happens to have installed one first, which makes the pass
  // depend on test order.
  function watchAlert(): jest.SpyInstance {
    return jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  }

  function confirmAlert(spy: jest.SpyInstance): void {
    const buttons = spy.mock.calls[spy.mock.calls.length - 1][2] as any[];
    const destructive = buttons.find(button => button.style === 'destructive');

    expect(destructive).toBeDefined();
    destructive.onPress();
  }

  it('asks before deleting, and does not delete on the prompt alone', async () => {
    const card = makeCard('unread-1', false);
    const root = await renderInbox([card]);
    const spy = watchAlert();

    await act(async () => {
      touchableWithLabel(root, 'Delete')[0].props.onPress();
    });

    expect(spy).toHaveBeenCalled();
    expect(card.delete).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('deletes the card and refetches the list once confirmed', async () => {
    const card = makeCard('unread-1', false);
    const root = await renderInbox([card]);
    (Insider as any).appCards.getCampaigns.mockClear();
    const spy = watchAlert();

    await act(async () => {
      touchableWithLabel(root, 'Delete')[0].props.onPress();
    });
    await act(async () => {
      confirmAlert(spy);
    });

    expect(card.delete).toHaveBeenCalledTimes(1);
    expect((Insider as any).appCards.getCampaigns).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('AppCardsInbox Remove All', () => {
  it('deletes every listed card by id once the prompt is confirmed', async () => {
    const root = await renderInbox([makeCard('c1', false), makeCard('c2', true)]);
    const spy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    await act(async () => {
      touchableWithLabel(root, 'Remove All')[0].props.onPress();
    });
    const buttons = spy.mock.calls[spy.mock.calls.length - 1][2] as any[];
    const deleteAll = buttons.find(button => button.style === 'destructive');

    expect(deleteAll.text).toBe('Delete All');
    await act(async () => {
      await deleteAll.onPress();
    });

    expect((Insider as any).appCards.delete).toHaveBeenCalledTimes(1);
    expect((Insider as any).appCards.delete).toHaveBeenCalledWith(['c1', 'c2']);
    spy.mockRestore();
  });
});

describe('AppCardsInbox FlatList bindings', () => {
  it('tracks a view once per card id, however often the card becomes visible', async () => {
    const c1 = makeCard('c1', false);
    const c2 = makeCard('c2', false);
    const root = await renderInbox([c1, c2]);
    c1.view.mockClear();
    c2.view.mockClear();
    const list = root.findByType(FlatList);

    act(() => {
      list.props.onViewableItemsChanged({
        viewableItems: [{ item: c1 }, { item: c2 }, { item: c1 }],
        changed: [],
      });
    });

    expect(c1.view).toHaveBeenCalledTimes(1);
    expect(c2.view).toHaveBeenCalledTimes(1);
  });

  it('keys each row by the card id', async () => {
    const root = await renderInbox([makeCard('c1', false)]);
    const list = root.findByType(FlatList);

    expect(list.props.keyExtractor(makeCard('c1', false), 0)).toBe('c1');
  });
});

describe('CardDetail buttons', () => {
  it('forwards a detail button press to that button click', async () => {
    const button = { id: 'b1', appCardId: 'c1', text: 'Go Now', action: null, click: jest.fn() };
    const card = { ...makeCard('c1', false), buttons: [button] };
    const root = await renderInbox([card]);
    const row = root
      .findAllByType(TouchableOpacity)
      .find((node: any) => typeof node.props.onLongPress === 'function');

    await act(async () => {
      row.props.onPress();
    });
    await act(async () => {
      touchableWithLabel(root, 'Go Now')[0].props.onPress();
    });

    expect(button.click).toHaveBeenCalledTimes(1);
  });
});
