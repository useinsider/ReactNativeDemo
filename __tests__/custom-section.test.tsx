import React from 'react';
import { StyleSheet, Text } from 'react-native';
import renderer, { act } from 'react-test-renderer';
import CustomSection from '../src/components/CustomSection';
import Card from '../src/components/Card';
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
  it('wraps its children in a Card surface', () => {
    const root = render();
    const card = root.findByType(Card);

    expect(card).toBeDefined();
  });

  it('renders the children inside that Card', () => {
    const root = render();
    const card = root.findByType(Card);
    const child = card.findAllByType(Text).find((node: any) => node.props.children === 'child');

    expect(child).toBeDefined();
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
