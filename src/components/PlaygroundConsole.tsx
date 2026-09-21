import React, { useRef, useSyncExternalStore } from 'react';
import { Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';
import { playgroundLog } from '../playground/playgroundLog';

// Matches the fixed console height of the native and Flutter demos.
export const CONSOLE_HEIGHT = 124;

/**
 * The Playground output card: a fixed-height white card that scrolls
 * internally to the newest line rather than growing down the screen.
 */
function PlaygroundConsole() {
  const scrollRef = useRef<ScrollView>(null);
  const lines = useSyncExternalStore(playgroundLog.subscribe, playgroundLog.getLines);

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.card}
      contentContainerStyle={styles.content}
      // Deferred a frame: scrolling inside the size-change callback runs before
      // Android has applied the new content height, leaving the view short of the end.
      onContentSizeChange={() =>
        requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: false }))
      }
    >
      <Text selectable style={styles.text}>
        {lines.join('\n')}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    height: CONSOLE_HEIGHT,
    flexGrow: 0,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  content: {
    padding: 14,
  },
  text: {
    // 'monospace' only resolves on Android; iOS needs a real family name.
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    fontSize: 13,
    color: colors.onSurface,
  },
});

export default PlaygroundConsole;
