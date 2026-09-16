/**
 * @format
 */

import 'react-native';


// The Insider SDK ships untranspiled ESM, which the react-native jest preset
// does not transform, so the whole SDK surface is stubbed for this suite.
jest.mock('react-native-insider', () => require('../test-utils/insiderMocks').sdkModule());

jest.mock('react-native-insider/src/ContentOptimizerDataType', () => require('../test-utils/insiderMocks').enumModule());

jest.mock('react-native-insider/src/InsiderCallbackType', () => require('../test-utils/insiderMocks').enumModule());

jest.mock('react-native-insider/src/InsiderGender', () => require('../test-utils/insiderMocks').enumModule());

jest.mock('react-native-insider/src/InsiderIdentifier', () => require('../test-utils/insiderMocks').enumModule());

jest.mock('react-native-safe-area-context', () => require('../test-utils/insiderMocks').safeAreaModule());

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import React from 'react';
import { StyleSheet, Text } from 'react-native';
import App from '../App';
import { colors, fonts } from '../src/theme';

// Note: test renderer must be required after react-native.
import renderer, { act } from 'react-test-renderer';

const SECTION_DESCRIPTION =
  'This Demo contains simple methods that you can use with the Insider SDK.';

// `styles` is module-local in App.tsx, so the style object is reached through
// the rendered Section description Text instead of a direct import.
function renderSectionDescriptionStyle(): any {
  let component: any;
  act(() => {
    component = renderer.create(<App />);
  });
  const description = component.root.findAllByType(Text).find((node: any) => {
    const children = Array.isArray(node.props.children)
      ? node.props.children.join('')
      : node.props.children;
    return (
      typeof children === 'string' &&
      children.replace(/\s+/g, ' ').trim() === SECTION_DESCRIPTION
    );
  });

  expect(description).toBeDefined();
  return StyleSheet.flatten(description.props.style);
}

it('renders correctly', () => {
  renderer.create(<App />);
});

describe('styles.sectionDescription', () => {
  it('overrides the typography.body size with fontSize 18', () => {
    expect(renderSectionDescriptionStyle().fontSize).toBe(18);
  });

  it('keeps the typography.body font family', () => {
    expect(renderSectionDescriptionStyle().fontFamily).toBe(fonts.medium);
  });

  it('paints the description with the variant on-surface colour', () => {
    expect(renderSectionDescriptionStyle().color).toBe(colors.onSurfaceVariant);
  });
});
