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
    return JSON.stringify(value);
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

let installed = false;

/**
 * Mirrors `console.log` and `console.warn` into the Playground console while
 * keeping the original developer-console output.
 */
export function installConsoleCapture() {
  if (installed) {
    return;
  }
  installed = true;

  (['log', 'warn'] as const).forEach((method) => {
    const original = console[method].bind(console);
    console[method] = (...values: unknown[]) => {
      playgroundLog.add(...values);
      original(...values);
    };
  });
}
