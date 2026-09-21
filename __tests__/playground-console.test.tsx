import React from 'react';
import { Platform, ScrollView, StyleSheet, Text } from 'react-native';
import renderer, { act } from 'react-test-renderer';
import PlaygroundConsole, { CONSOLE_HEIGHT } from '../src/components/PlaygroundConsole';
import { colors } from '../src/theme';
import { playgroundLog } from '../src/playground/playgroundLog';

function render(): any {
  let component: any;
  act(() => {
    component = renderer.create(<PlaygroundConsole />);
  });
  return component;
}

function cardStyle(component: any): any {
  return StyleSheet.flatten(component.root.findByType(ScrollView).props.style);
}

describe('PlaygroundConsole', () => {
  beforeEach(() => {
    playgroundLog.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('re-renders the lines added to the store after mount', () => {
    const component = render();
    const before = component.root.findByType(Text).props.children;

    act(() => {
      playgroundLog.add('[INSIDER] initialized');
    });

    expect(component.root.findByType(Text).props.children).not.toBe(before);
  });

  it('shows the line added to the store after mount', () => {
    const component = render();

    act(() => {
      playgroundLog.add('[INSIDER] initialized');
    });

    expect(component.root.findByType(Text).props.children).toBe('[INSIDER] initialized');
  });

  it('keeps the card at the fixed console height', () => {
    expect(cardStyle(render()).height).toBe(CONSOLE_HEIGHT);
  });

  it('does not let the card grow with its content', () => {
    expect(cardStyle(render()).flexGrow).toBe(0);
  });

  it('defers the scroll to the next frame when the content size changes', () => {
    const component = render();
    const requestFrame = jest
      .spyOn(global, 'requestAnimationFrame')
      .mockImplementation(() => 0 as unknown as number);

    act(() => {
      component.root.findByType(ScrollView).props.onContentSizeChange(0, 500);
    });

    expect(requestFrame).toHaveBeenCalledTimes(1);
  });

  it('scrolls to the end only once the deferred frame runs', () => {
    const component = render();
    const scrollView = component.root.findByType(ScrollView);
    const scrollToEnd = jest.spyOn(scrollView.instance, 'scrollToEnd').mockImplementation(() => {});
    let frame: (() => void) | undefined;
    jest.spyOn(global, 'requestAnimationFrame').mockImplementation((callback: any) => {
      frame = callback;
      return 0 as unknown as number;
    });

    act(() => {
      scrollView.props.onContentSizeChange(0, 500);
    });
    expect(scrollToEnd).not.toHaveBeenCalled();

    act(() => {
      frame?.();
    });

    expect(scrollToEnd).toHaveBeenCalledWith({ animated: false });
  });

  it('uses a family iOS can resolve for the console text', () => {
    expect(Platform.OS).toBe('ios');

    const style = StyleSheet.flatten(render().root.findByType(Text).props.style);

    expect(style.fontFamily).toBe('Menlo');
  });

  it('uses monospace for the console text on Android', () => {
    jest.isolateModules(() => {
      const RN = require('react-native');
      jest
        .spyOn(RN.Platform, 'select')
        .mockImplementation((spec: any) => spec.android ?? spec.default);

      const InnerReact = require('react');
      const innerRenderer = require('react-test-renderer');
      const AndroidConsole = require('../src/components/PlaygroundConsole').default;

      let component: any;
      innerRenderer.act(() => {
        component = innerRenderer.create(InnerReact.createElement(AndroidConsole));
      });

      const style = RN.StyleSheet.flatten(component.root.findByType(RN.Text).props.style);

      expect(style.fontFamily).toBe('monospace');
    });
  });

  it('separates the console lines with a newline', () => {
    const component = render();

    act(() => {
      playgroundLog.add('a');
      playgroundLog.add('b');
    });

    expect(component.root.findByType(Text).props.children).toBe('a\nb');
  });

  it('lets the console lines be selected for copying', () => {
    expect(render().root.findByType(Text).props.selectable).toBe(true);
  });

  it('paints the card on the white surface colour', () => {
    expect(cardStyle(render()).backgroundColor).toBe(colors.white);
  });

  it('outlines the card with a one point border', () => {
    expect(cardStyle(render()).borderWidth).toBe(1);
  });

  it('draws the card outline with the outline colour token', () => {
    expect(cardStyle(render()).borderColor).toBe(colors.outline);
  });

  it('rounds the card corners', () => {
    expect(cardStyle(render()).borderRadius).toBe(14);
  });
});
