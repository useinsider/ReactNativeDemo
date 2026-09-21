import { MAX_LINES, installConsoleCapture, playgroundLog } from '../src/playground/playgroundLog';

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

  it('mirrors console.log into the store and still calls the original', () => {
    const original = jest.fn();
    const saved = console.log;
    console.log = original;
    try {
      installConsoleCapture();
      console.log('[INSIDER] initialized');

      expect(playgroundLog.getLines()).toEqual(['[INSIDER] initialized']);
      expect(original).toHaveBeenCalledWith('[INSIDER] initialized');
    } finally {
      console.log = saved;
    }
  });
});
