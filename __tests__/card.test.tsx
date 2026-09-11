import React from 'react';
import { StyleSheet, Text } from 'react-native';
import renderer, { act } from 'react-test-renderer';
import Card from '../src/components/Card';
import { colors } from '../src/theme';

function flattenCardStyle(element: React.ReactElement): any {
  let component: any;
  act(() => {
    component = renderer.create(element);
  });
  // StyleSheet.flatten recurses; a hand-rolled `.flat()` stops at one level and turns a nested
  // style array into index-keyed junk.
  return StyleSheet.flatten(component.toJSON().props.style);
}

describe('Card', () => {
  it('renders a white, 18-radius, 1px outlined surface without shadow', () => {
    const style = flattenCardStyle(<Card><Text>content</Text></Card>);

    expect(style.backgroundColor).toBe(colors.white);
    expect(style.borderRadius).toBe(18);
    expect(style.borderWidth).toBe(1);
    expect(style.borderColor).toBe(colors.outline);
    expect(style.elevation).toBe(0);
    expect(style.shadowOpacity).toBe(0);
  });

  it('pads the surface with 16 on every side', () => {
    expect(flattenCardStyle(<Card><Text>content</Text></Card>).padding).toBe(16);
  });
});

describe('Card style override', () => {
  it('lets the style prop add a marginTop the base style does not set', () => {
    const style = flattenCardStyle(
      <Card style={{ marginTop: 7 }}><Text>content</Text></Card>,
    );

    expect(style.marginTop).toBe(7);
  });

  it('keeps the base padding that the style prop does not override', () => {
    const style = flattenCardStyle(
      <Card style={{ marginTop: 7 }}><Text>content</Text></Card>,
    );

    expect(style.padding).toBe(16);
  });
});
