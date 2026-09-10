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

describe('NotificationService.didReceive', () => {
  it('never force-unwraps contentHandler or bestAttemptContent', () => {
    expect(forceUnwraps(read(SERVICE_SWIFT), 'contentHandler|bestAttemptContent')).toEqual([]);
  });

  // Any conditional binding is fine — `if let`, `guard let`, or a nil comparison. What matters is
  // that neither property is force-unwrapped, which the sweep above covers.
  it('binds both stored properties before calling back', () => {
    expect(read(SERVICE_SWIFT)).toMatch(
      /(if|guard)\s+let\s+contentHandler.*bestAttemptContent|contentHandler\?\(/s,
    );
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

  it('still scrolls and keeps the notification open when the outlet is there', () => {
    const source = read(CONTENT_SWIFT);

    expect(source).toContain('carousel.scrollToItem(at: nextIndex, animated: true)');
    expect(source).toContain('completion(.doNotDismiss)');
  });
});
