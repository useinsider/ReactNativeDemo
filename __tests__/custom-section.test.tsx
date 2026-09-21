import React from 'react';
import { StyleSheet, Text } from 'react-native';
import renderer, { act } from 'react-test-renderer';
import CustomSection from '../src/components/CustomSection';
import { colors, typography } from '../src/theme';

const TITLE = 'Reinit With Partner Name';

function render(): any {
  let component: any;
  act(() => {
    component = renderer.create(
      <CustomSection title={TITLE}>
        <Text>child</Text>
      </CustomSection>,
    );
  });
  return component.root;
}

function titleStyle(root: any) {
  const title = root
    .findAllByType(Text)
    .find((node: any) => node.props.children === TITLE);
  expect(title).toBeDefined();
  return StyleSheet.flatten(title.props.style);
}

describe('CustomSection', () => {
  it('renders the children directly, without a card surface', () => {
    const root = render();
    const child = root.findAllByType(Text).find((node: any) => node.props.children === 'child');

    expect(child).toBeDefined();
    expect(child.parent.type).not.toBe('Card');
  });

  it('styles the title with the title typography token', () => {
    const style = titleStyle(render());

    expect(style.fontFamily).toBe(typography.title.fontFamily);
    expect(style.fontSize).toBe(typography.title.fontSize);
  });

  it('paints the title with the on-surface colour token', () => {
    expect(titleStyle(render()).color).toBe(colors.onSurface);
  });
});
