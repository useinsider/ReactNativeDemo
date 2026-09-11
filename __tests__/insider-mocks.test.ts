import { enumModule, safeAreaModule, sdkModule } from '../test-utils/insiderMocks';

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

  it('leaves symbol members undefined so it is not mistaken for an iterable', () => {
    expect((enumModule().default as any)[Symbol.iterator]).toBeUndefined();
  });
});

describe('sdkModule', () => {
  it('exposes a callable default export', () => {
    expect(typeof sdkModule().default).toBe('function');
  });

  it('auto-vivifies a nested property path into a jest mock', () => {
    expect(jest.isMockFunction(sdkModule().default.appCards.getCampaigns)).toBe(true);
  });

  it('returns the same stub for repeated access to one path', () => {
    const module = sdkModule();

    expect(module.default.a.b).toBe(module.default.a.b);
  });

  it('leaves then undefined so the stub is not awaited as a thenable', () => {
    expect(sdkModule().default.then).toBeUndefined();
  });
});

describe('sdkModule symbol members', () => {
  // The proxy hands symbol keys straight to the underlying jest.fn instead of auto-vivifying a
  // stub. Vivified, the stub would answer Symbol.iterator with a function and any spread or
  // destructure of it would take the iterable path instead of failing loudly.
  it('leaves symbol members undefined so the stub is not mistaken for an iterable', () => {
    expect((sdkModule().default as any)[Symbol.iterator]).toBeUndefined();
  });
});
