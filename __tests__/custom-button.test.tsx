import React from 'react';
import { StyleSheet, Text, TouchableHighlight } from 'react-native';
import renderer, { act } from 'react-test-renderer';
import CustomButton from '../src/components/CustomButton';
import { colors, typography } from '../src/theme';

function render(element: React.ReactElement): any {
  let component: any;
  act(() => {
    component = renderer.create(element);
  });
  return component.root;
}

describe('CustomButton', () => {
  it('paints the button with the orange token background', () => {
    const root = render(<CustomButton text="Press" onPress={() => {}} />);
    const style = StyleSheet.flatten(root.findByType(TouchableHighlight).props.style);

    expect(style.backgroundColor).toBe(colors.orange);
  });

  it('uses the dark orange token as the touch underlay', () => {
    const root = render(<CustomButton text="Press" onPress={() => {}} />);

    expect(root.findByType(TouchableHighlight).props.underlayColor).toBe(colors.orangeDark);
  });

  it('styles the label with the button typography token', () => {
    const root = render(<CustomButton text="Press" onPress={() => {}} />);
    const style = StyleSheet.flatten(root.findByType(Text).props.style);

    expect(style.fontFamily).toBe(typography.button.fontFamily);
    expect(style.fontSize).toBe(typography.button.fontSize);
  });
});

describe('CustomButton buttonStyle override', () => {
  it('lets buttonStyle win over the base background colour', () => {
    const root = render(
      <CustomButton
        text="Delete"
        buttonStyle={{ backgroundColor: colors.orangeDark }}
        onPress={() => {}}
      />,
    );
    const style = StyleSheet.flatten(root.findByType(TouchableHighlight).props.style);

    expect(style.backgroundColor).toBe(colors.orangeDark);
  });

  it('keeps the base styles that buttonStyle does not override', () => {
    const root = render(
      <CustomButton
        text="Delete"
        buttonStyle={{ backgroundColor: colors.orangeDark }}
        onPress={() => {}}
      />,
    );
    const style = StyleSheet.flatten(root.findByType(TouchableHighlight).props.style);

    expect(style.borderRadius).toBe(18);
    expect(style.padding).toBe(10);
  });
});
