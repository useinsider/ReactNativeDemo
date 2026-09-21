import React from 'react';
import { Image, StyleSheet } from 'react-native';
import renderer, { act } from 'react-test-renderer';
import Header from '../src/components/Header';
import { colors } from '../src/theme';
import { playgroundLog } from '../src/playground/playgroundLog';

function render(): any {
  let component: any;
  act(() => {
    component = renderer.create(<Header />);
  });
  return component;
}

describe('Header', () => {
  it('renders the light insider logo asset', () => {
    const [image] = render().root.findAllByType(Image);

    expect(image.props.source).toEqual(require('../assets/insider-logo.png'));
  });

  it('does not render the white logo variant', () => {
    const [image] = render().root.findAllByType(Image);

    expect(image.props.source).not.toEqual(require('../assets/insider-white-logo.png'));
  });

  it('blends the header into the page surface', () => {
    const tree: any = render().toJSON();
    const style = StyleSheet.flatten(tree.props.style);

    expect(style.backgroundColor).toBe(colors.surface);
  });

  it('clears the Playground console from the trash button', () => {
    playgroundLog.add('[INSIDER] initialized');
    const button = render().root.findByProps({ accessibilityLabel: 'Clear' });

    act(() => {
      button.props.onPress();
    });

    expect(playgroundLog.getLines()).toEqual([]);
  });
});
