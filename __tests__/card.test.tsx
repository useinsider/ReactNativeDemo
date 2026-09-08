import React from 'react';
import { Text } from 'react-native';
import renderer, { act } from 'react-test-renderer';
import Card from '../src/components/Card';
import { colors } from '../src/theme';

describe('Card', () => {
  it('renders a white, 18-radius, 1px outlined surface without shadow', () => {
    let component: any;
    act(() => {
      component = renderer.create(<Card><Text>content</Text></Card>);
    });
    const tree: any = component.toJSON();
    const rawStyle = tree.props.style;
    const style = Array.isArray(rawStyle) ? Object.assign({}, ...rawStyle.flat().filter(Boolean)) : rawStyle;

    expect(style.backgroundColor).toBe(colors.white);
    expect(style.borderRadius).toBe(18);
    expect(style.borderWidth).toBe(1);
    expect(style.borderColor).toBe(colors.outline);
    expect(style.elevation).toBe(0);
    expect(style.shadowOpacity).toBe(0);
  });
});
