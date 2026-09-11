import { enumModule, safeAreaModule } from '../test-utils/insiderMocks';

/**
 * These stubs stand in for real modules across several suites, so their shape is a contract: a
 * suite only discovers a wrong shape once the code under test reaches for the missing member.
 */
describe('safeAreaModule', () => {
  it('reports zero insets on every edge', () => {
    expect(safeAreaModule().useSafeAreaInsets()).toEqual({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    });
  });

  it('has no initial window metrics', () => {
    expect(safeAreaModule().initialWindowMetrics).toBeNull();
  });

  it('renders its providers as pass-throughs', () => {
    const module = safeAreaModule();

    expect(module.SafeAreaProvider({ children: 'child' })).toBe('child');
    expect(module.SafeAreaView({ children: 'child' })).toBe('child');
  });
});

describe('enumModule', () => {
  it('answers every string member with its own name', () => {
    expect(enumModule().default.SOME_MEMBER).toBe('SOME_MEMBER');
  });
});
