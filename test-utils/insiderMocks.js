/**
 * Shared jest module mocks.
 *
 * The Insider SDK ships untranspiled ESM that the react-native jest preset does not transform, so
 * every suite rendering a screen has to stub it. Defining the stub shapes once keeps the suites
 * from drifting apart — a mock that is a superset in one file and a subset in another fails only
 * in the subset's suite, and only once the code starts using the missing member.
 */

/** The SDK's enum modules: every string property answers with its own name. */
function enumModule() {
  return {
    __esModule: true,
    default: new Proxy(
      {},
      {
        get: (_target, prop) => (typeof prop === 'string' ? prop : undefined),
      },
    ),
  };
}

/** The SDK's default export: any property path resolves to a callable. */
function sdkModule() {
  const stub = () =>
    new Proxy(jest.fn(), {
      get: (target, prop) => {
        if (typeof prop === 'symbol' || prop === 'then') {
          return target[prop];
        }
        if (!(prop in target)) {
          target[prop] = stub();
        }
        return target[prop];
      },
    });
  return { __esModule: true, default: stub() };
}

/** Safe-area context, including the hooks a screen may reach for. */
function safeAreaModule() {
  return {
    __esModule: true,
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    initialWindowMetrics: null,
  };
}

module.exports = { enumModule, sdkModule, safeAreaModule };
