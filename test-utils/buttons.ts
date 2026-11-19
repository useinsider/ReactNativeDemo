import React from 'react';
import { Text, TouchableHighlight } from 'react-native';
import renderer, { act } from 'react-test-renderer';

export async function render(element: React.ReactElement): Promise<any> {
  let component: any;
  await act(async () => {
    component = renderer.create(element);
  });
  return component;
}

export function findButton(root: any, label: string): any | undefined {
  return root
    .findAllByType(TouchableHighlight)
    .find((node: any) => node.findAllByType(Text)[0]?.props.children === label);
}

export async function pressButton(root: any, label: string): Promise<void> {
  const button = findButton(root, label);
  if (!button) {
    throw new Error(`No button labelled "${label}"`);
  }
  await act(async () => {
    button.props.onPress();
  });
}
