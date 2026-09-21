/**
 * The lines the Playground console shows.
 *
 * The demo reports every SDK call through `console.log`, which only reaches a
 * developer with a debugger attached. The native and Flutter demos surface the
 * same output on screen, so the console calls are mirrored into this store.
 */

// Only the most recent lines are kept so the console never grows unbounded;
// the native and Flutter demos use the same cap.
export const MAX_LINES = 200;

type Listener = () => void;

let lines: string[] = [];
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => listener());
}

function format(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (value instanceof Error) {
    return value.message;
  }
  try {
    // undefined and functions have no JSON form; String() keeps them visible
    // so the on-screen console never silently drops an argument.
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}

export const playgroundLog = {
  getLines(): readonly string[] {
    return lines;
  },

  add(...values: unknown[]) {
    lines = [...lines, values.map(format).join(' ')].slice(-MAX_LINES);
    notify();
  },

  clear() {
    if (lines.length === 0) {
      return;
    }
    lines = [];
    notify();
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

const CAPTURED_METHODS = ['log', 'warn', 'error'] as const;

let originals: Partial<Record<(typeof CAPTURED_METHODS)[number], typeof console.log>> = {};

/**
 * Mirrors `console.log`, `console.warn` and `console.error` into the Playground
 * console while keeping the original developer-console output.
 */
export function installConsoleCapture() {
  if (Object.keys(originals).length > 0) {
    return;
  }

  CAPTURED_METHODS.forEach((method) => {
    const original = console[method].bind(console);
    originals[method] = original;
    console[method] = (...values: unknown[]) => {
      playgroundLog.add(...values);
      original(...values);
    };
  });
}

/** Restores the console methods `installConsoleCapture` replaced. */
export function uninstallConsoleCapture() {
  CAPTURED_METHODS.forEach((method) => {
    const original = originals[method];
    if (original) {
      console[method] = original;
    }
  });
  originals = {};
}
