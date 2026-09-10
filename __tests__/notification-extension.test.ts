import fs from 'fs';
import path from 'path';

const REPO_ROOT = path.resolve(__dirname, '..');

function read(relativePath: string): string {
  return fs.readFileSync(path.join(REPO_ROOT, relativePath), 'utf8');
}

const STORYBOARD = 'ios/InsiderNotificationContent/Base.lproj/MainInterface.storyboard';
const CONTENT_PLIST = 'ios/InsiderNotificationContent/Info.plist';
const SERVICE_PLIST = 'ios/InsiderNotificationService/Info.plist';
const SERVICE_SWIFT = 'ios/InsiderNotificationService/NotificationService.swift';

describe('notification content extension storyboard', () => {
  it('binds the scene to the NotificationViewController class', () => {
    expect(read(STORYBOARD)).toContain('customClass="NotificationViewController"');
  });

  it('resolves that class from the InsiderNotificationContent module', () => {
    expect(read(STORYBOARD)).toContain('customModule="InsiderNotificationContent"');
  });

  it('exposes the carousel outlet expected by the view controller', () => {
    expect(read(STORYBOARD)).toContain('property="carousel"');
  });

  it('no longer exposes the renamed label outlet', () => {
    expect(read(STORYBOARD)).not.toContain('property="label"');
  });
});

describe('notification extension Info.plist wiring', () => {
  it('points the content extension at the MainInterface storyboard', () => {
    const plist = read(CONTENT_PLIST);
    const match = plist.match(
      /<key>NSExtensionMainStoryboard<\/key>\s*<string>([^<]*)<\/string>/,
    );

    expect(match).not.toBeNull();
    expect(match![1]).toBe('MainInterface');
  });

  it('points the service extension at the NotificationService principal class', () => {
    const plist = read(SERVICE_PLIST);
    const match = plist.match(
      /<key>NSExtensionPrincipalClass<\/key>\s*<string>([^<]*)<\/string>/,
    );

    expect(match).not.toBeNull();
    expect(match![1]).toBe('$(PRODUCT_MODULE_NAME).NotificationService');
  });
});

const CONTENT_SWIFT = 'ios/InsiderNotificationContent/NotificationViewController.swift';

/**
 * A force unwrap is `name!` followed by something other than `=`; `name != nil` is a comparison and
 * must not be flagged, or a correct nil-check reads as a violation.
 */
function forceUnwraps(source: string, name: string): string[] {
  return source.match(new RegExp(`\\b(?:${name})\\s*!(?!=)`, 'g')) ?? [];
}

describe('forceUnwraps', () => {
  it('flags a real force unwrap', () => {
    expect(
      forceUnwraps('contentHandler!(bestAttemptContent!)', 'contentHandler|bestAttemptContent'),
    ).toHaveLength(2);
  });

  it('leaves a nil comparison alone', () => {
    expect(
      forceUnwraps(
        'if contentHandler != nil, bestAttemptContent != nil {',
        'contentHandler|bestAttemptContent',
      ),
    ).toEqual([]);
  });
});

/**
 * Returns the body of one Swift method. Assertions about a method have to be scoped to it: a
 * whole-file regex happily matches a sibling method and reads as green for the wrong reason.
 */
function occurrences(source: string, needle: string): number {
  return source.split(needle).length - 1;
}

function methodBody(source: string, signatureStart: string): string {
  const start = source.indexOf(signatureStart);
  expect(start).toBeGreaterThan(-1);

  // Methods here are indented four spaces, so their closing brace is the next `\n    }`.
  const end = source.indexOf('\n    }', start);
  expect(end).toBeGreaterThan(start);

  return source.slice(start, end);
}

describe('methodBody', () => {
  it('stops at the end of the method it was asked for', () => {
    const body = methodBody(read(SERVICE_SWIFT), 'override func didReceive(');

    expect(body).toContain('showInsiderRichPush');
    expect(body).not.toContain('serviceExtensionTimeWillExpire');
  });
});

describe('NotificationService', () => {
  it('never force-unwraps contentHandler or bestAttemptContent', () => {
    expect(forceUnwraps(read(SERVICE_SWIFT), 'contentHandler|bestAttemptContent')).toEqual([]);
  });
});

describe('NotificationService.didReceive', () => {
  // The mutable copy is the one cast in this method. As a force cast it would crash the extension
  // whenever the copy fails, and the force-unwrap sweep above cannot see an `as!`.
  it('conditionally casts the mutable copy rather than force-casting it', () => {
    const body = methodBody(read(SERVICE_SWIFT), 'override func didReceive(');

    expect(body).toContain('guard let content = request.content.mutableCopy() as? UNMutableNotificationContent');
    expect(body).not.toMatch(/as!\s/);
  });

  it('still delivers the original content when that copy fails', () => {
    const body = methodBody(read(SERVICE_SWIFT), 'override func didReceive(');

    expect(body).toContain('contentHandler(request.content)');
  });
});

describe('NotificationService.serviceExtensionTimeWillExpire', () => {
  // This is the method that binds the stored properties; the assertion used to sit under
  // didReceive, where nothing could satisfy it, and passed only by matching this one.
  it('binds both stored properties before calling back', () => {
    const body = methodBody(read(SERVICE_SWIFT), 'override func serviceExtensionTimeWillExpire()');

    expect(body).toMatch(/(if|guard)\s+let\s+contentHandler,\s*let\s+bestAttemptContent/);
    expect(body).toContain('contentHandler(bestAttemptContent)');
  });
});

describe('NotificationViewController.didReceive', () => {
  // The fix landed in this file, so the sweep has to cover it too.
  it('never force-unwraps the carousel outlet', () => {
    // The `iCarousel!` in the outlet declaration is a type annotation, not a force unwrap: the
    // sweep looks for `carousel!`, so the declaration never matches and needs no exclusion.
    expect(forceUnwraps(read(CONTENT_SWIFT), 'carousel')).toEqual([]);
  });

  it('branches on the action alone, so a missing outlet cannot reach the placeholder path', () => {
    const source = read(CONTENT_SWIFT);

    // Pin the literal, not just its shape: this identifier is the contract with the SDK, and a
    // typo in it sends every Next tap down the placeholder path.
    expect(source).toMatch(/guard response\.actionIdentifier == "insider_int_push_next" else \{/);
    expect(source).not.toMatch(/if let carousel[^\n]*actionIdentifier/);
  });

  // The regression this port introduced: a nil outlet fell through to the placeholder path, so a
  // Next tap was reported as a body tap and the notification was dismissed. Counting is what pins
  // it — slicing between markers silently passes when a marker moves, which is how an earlier
  // version of this test let the regression back in.
  it('takes the placeholder path exactly once, for non-Next actions only', () => {
    const body = methodBody(read(CONTENT_SWIFT), '_ response: UNNotificationResponse');

    expect(occurrences(body, 'logPlaceholderClick')).toBe(1);
    expect(occurrences(body, 'dismissAndForwardAction')).toBe(1);
  });

  it('puts that single placeholder path in the action guard, ahead of any carousel handling', () => {
    const body = methodBody(read(CONTENT_SWIFT), '_ response: UNNotificationResponse');
    const placeholder = body.indexOf('logPlaceholderClick');
    const carousel = body.indexOf('didReceiveResponse');

    expect(placeholder).toBeGreaterThan(-1);
    expect(carousel).toBeGreaterThan(-1);
    // A nil outlet reaching the placeholder path would have to sit after the carousel work.
    expect(placeholder).toBeLessThan(carousel);
  });

  it('still scrolls and keeps the notification open when the outlet is there', () => {
    const source = read(CONTENT_SWIFT);

    expect(source).toContain('carousel.scrollToItem(at: nextIndex, animated: true)');
    expect(source).toContain('completion(.doNotDismiss)');
  });
});
