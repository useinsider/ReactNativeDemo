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

  it('renders the trash icon asset in the clear button', () => {
    const [, icon] = render().root.findAllByType(Image);

    expect(icon.props.source).toEqual(require('../assets/trash.png'));
  });

  it('tints the trash icon with the on-surface color', () => {
    const [, icon] = render().root.findAllByType(Image);
    const style = StyleSheet.flatten(icon.props.style);

    expect(style.tintColor).toBe(colors.onSurface);
  });

  it('keeps the header at least as tall as the clear button', () => {
    const component = render();
    const headerStyle = StyleSheet.flatten(component.toJSON().props.style);
    const [button] = component.root.findAllByProps({ accessibilityLabel: 'Clear' });
    const buttonStyle = StyleSheet.flatten(button.props.style);

    expect(headerStyle.minHeight).toBeGreaterThanOrEqual(buttonStyle.height);
  });

  it('clears the Playground console from the trash button', () => {
    playgroundLog.add('[INSIDER] initialized');
    const button = render().root.findByProps({ accessibilityLabel: 'Clear' });

    act(() => {
      button.props.onPress();
    });

    expect(playgroundLog.getLines()).toEqual([]);
  });

  it('lifts the clear button out of the header flow', () => {
    const [button] = render().root.findAllByProps({ accessibilityLabel: 'Clear' });
    const style = StyleSheet.flatten(button.props.style);

    expect(style.position).toBe('absolute');
  });

  it('pins the clear button to the trailing edge', () => {
    const [button] = render().root.findAllByProps({ accessibilityLabel: 'Clear' });
    const style = StyleSheet.flatten(button.props.style);

    expect(style.right).toBe(10);
  });

  it('renders the logo at its design size', () => {
    const [image] = render().root.findAllByType(Image);
    const style = StyleSheet.flatten(image.props.style);

    expect(style).toMatchObject({ width: 173, height: 24 });
  });

  it('scales the logo down without cropping it', () => {
    const [image] = render().root.findAllByType(Image);
    const style = StyleSheet.flatten(image.props.style);

    expect(style.resizeMode).toBe('contain');
  });
});
