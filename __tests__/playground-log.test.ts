import {
  MAX_LINES,
  installConsoleCapture,
  playgroundLog,
  uninstallConsoleCapture,
} from '../src/playground/playgroundLog';

describe('playgroundLog', () => {
  beforeEach(() => {
    playgroundLog.clear();
  });

  it('joins the logged values into one line', () => {
    playgroundLog.add('[INSIDER][login]:', { id: 1 });

    expect(playgroundLog.getLines()).toEqual(['[INSIDER][login]: {"id":1}']);
  });

  it('keeps only the most recent lines', () => {
    for (let i = 0; i < MAX_LINES + 5; i++) {
      playgroundLog.add(`line ${i}`);
    }

    const lines = playgroundLog.getLines();
    expect(lines).toHaveLength(MAX_LINES);
    expect(lines[0]).toBe('line 5');
  });

  it('notifies subscribers until they unsubscribe', () => {
    const listener = jest.fn();
    const unsubscribe = playgroundLog.subscribe(listener);

    playgroundLog.add('first');
    unsubscribe();
    playgroundLog.add('second');

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it.each(['log', 'warn', 'error'] as const)(
    'mirrors console.%s into the store and still calls the original',
    (method) => {
      const original = jest.fn();
      const saved = console[method];
      console[method] = original;
      try {
        installConsoleCapture();
        console[method]('[INSIDER] initialized');

        expect(playgroundLog.getLines()).toEqual(['[INSIDER] initialized']);
        expect(original).toHaveBeenCalledWith('[INSIDER] initialized');
      } finally {
        uninstallConsoleCapture();
        console[method] = saved;
      }
    },
  );

  it('keeps undefined arguments visible', () => {
    playgroundLog.add('value:', undefined);

    expect(playgroundLog.getLines()).toEqual(['value: undefined']);
  });

  it('shows the message of a logged Error', () => {
    playgroundLog.add(new Error('boom'));

    expect(playgroundLog.getLines()).toEqual(['boom']);
  });

  it('does not notify subscribers when clearing an empty store', () => {
    const listener = jest.fn();
    const unsubscribe = playgroundLog.subscribe(listener);

    playgroundLog.clear();
    unsubscribe();

    expect(listener).not.toHaveBeenCalled();
  });

  it('captures a console line once when installed twice', () => {
    const saved = console.log;
    console.log = jest.fn();
    try {
      installConsoleCapture();
      installConsoleCapture();
      console.log('[INSIDER] initialized');

      expect(playgroundLog.getLines()).toEqual(['[INSIDER] initialized']);
    } finally {
      uninstallConsoleCapture();
      console.log = saved;
    }
  });

  it('stops capturing console output after uninstall', () => {
    const saved = console.log;
    console.log = jest.fn();
    try {
      installConsoleCapture();
      uninstallConsoleCapture();
      console.log('[INSIDER] initialized');

      expect(playgroundLog.getLines()).toEqual([]);
    } finally {
      console.log = saved;
    }
  });

  it.each(['warn', 'error'] as const)(
    'stops capturing console.%s after uninstall',
    (method) => {
      const saved = console[method];
      console[method] = jest.fn();
      try {
        installConsoleCapture();
        uninstallConsoleCapture();
        console[method]('[INSIDER] initialized');

        expect(playgroundLog.getLines()).toEqual([]);
      } finally {
        console[method] = saved;
      }
    },
  );

  it('notifies subscribers when clearing a non-empty store', () => {
    playgroundLog.add('[INSIDER] initialized');
    const listener = jest.fn();
    const unsubscribe = playgroundLog.subscribe(listener);

    playgroundLog.clear();
    unsubscribe();

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('keeps a value JSON cannot serialize visible', () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    playgroundLog.add(circular);

    expect(playgroundLog.getLines()).toEqual(['[object Object]']);
  });
});
