import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
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
