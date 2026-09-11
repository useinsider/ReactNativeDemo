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

  it('tells the SDK about the tap even when the outlet is missing', () => {
    // Objective-C evaluated this as an argument to scrollToItemAtIndex:, so it ran on a nil
    // carousel too. Moving it inside the outlet check would silently drop those taps.
    const body = methodBody(read(CONTENT_SWIFT), '_ response: UNNotificationResponse');
    const sdkCall = body.indexOf('didReceiveResponse');
    const outletCheck = body.indexOf('if let carousel');

    expect(sdkCall).toBeGreaterThan(-1);
    expect(outletCheck).toBeGreaterThan(-1);
    expect(sdkCall).toBeLessThan(outletCheck);
  });

  it('still scrolls and keeps the notification open when the outlet is there', () => {
    const source = read(CONTENT_SWIFT);

    expect(source).toContain('carousel.scrollToItem(at: nextIndex, animated: true)');
    expect(source).toContain('completion(.doNotDismiss)');
  });
});

describe('NotificationViewController.didReceive forwards the live slide index', () => {
  // The SDK is told which slide the user was on. A literal `0` here keeps every existing
  // ordering assertion green while reporting slide 0 for every Next tap, so pin the argument.
  it('forwards the carousel index, defaulting to 0 only when the outlet is missing', () => {
    const body = methodBody(read(CONTENT_SWIFT), '_ response: UNNotificationResponse');

    expect(body).toContain(
      'InsiderPushNotification.didReceiveResponse(carousel?.currentItemIndex ?? 0)',
    );
  });
});

describe('NotificationViewController.didReceive completion handling', () => {
  // Indentation is what discriminates: at method level the call runs on both arms, nested in
  // either arm it is eight spaces deeper and a nil outlet never calls the completion handler,
  // which hangs the extension until iOS times it out.
  it('calls the completion handler once, outside the carousel branch', () => {
    const body = methodBody(read(CONTENT_SWIFT), '_ response: UNNotificationResponse');

    expect(occurrences(body, 'completion(.doNotDismiss)')).toBe(1);
    expect(body).toMatch(/\n {8}completion\(\.doNotDismiss\)/);
  });
});

describe('NotificationViewController.didReceive unwired outlet diagnostics', () => {
  // Slice the else arm: a body-wide match would survive the arm being deleted and the log
  // reappearing somewhere else. This log is the only signal an outlet came unwired.
  it('logs on the arm reached when the carousel outlet is nil', () => {
    const body = methodBody(read(CONTENT_SWIFT), '_ response: UNNotificationResponse');
    const elseArm = body.slice(body.indexOf('} else {'));

    expect(body).toContain('} else {');
    expect(elseArm).toContain('os_log(');
  });

  it('imports the logging module that arm depends on', () => {
    expect(read(CONTENT_SWIFT)).toMatch(/^import os\.log$/m);
  });
});

/**
 * Returns the `else` arm of the action guard — the placeholder path. Position, not presence, is
 * what matters here: hoisted above the guard, these calls also run on a Next tap while every
 * counting or ordering assertion stays green, so scope the assertions to this arm.
 */
function actionGuardElseArm(body: string): string {
  const start = body.indexOf(
    'guard response.actionIdentifier == "insider_int_push_next" else {',
  );
  expect(start).toBeGreaterThan(-1);

  // The guard sits at method level, so its closing brace is the next `\n        }`.
  const end = body.indexOf('\n        }', start);
  expect(end).toBeGreaterThan(start);

  return body.slice(start, end);
}

describe('actionGuardElseArm', () => {
  // The regression variant: the placeholder path hoisted above the guard, so it runs on every tap.
  const hoisted = [
    '    func didReceive(',
    '        _ response: UNNotificationResponse,',
    '        completionHandler completion: @escaping (Option) -> Void',
    '    ) {',
    '        InsiderPushNotification.logPlaceholderClick(response)',
    '        completion(.dismissAndForwardAction)',
    '        guard response.actionIdentifier == "insider_int_push_next" else {',
    '            return',
    '        }',
    '',
    '        if let carousel = carousel {',
    '            carousel.scrollToItem(at: nextIndex, animated: true)',
    '        }',
    '        completion(.doNotDismiss)',
  ].join('\n');

  it('excludes a placeholder call hoisted above the guard', () => {
    expect(actionGuardElseArm(hoisted)).not.toContain('logPlaceholderClick');
  });

  it('stops at the guard, not at a later block closing at the same depth', () => {
    expect(actionGuardElseArm(hoisted)).not.toContain('scrollToItem');
  });
});

describe('NotificationViewController.didReceive placeholder path scoping', () => {
  // Containment in the guard arm is the assertion the ordering check could not make: a Next tap
  // must never report a body/placeholder click.
  it('reports the placeholder click only on the non-Next arm', () => {
    const arm = actionGuardElseArm(methodBody(read(CONTENT_SWIFT), '_ response: UNNotificationResponse'));

    expect(arm).toContain('InsiderPushNotification.logPlaceholderClick(response)');
  });

  // Hoisted out of this arm, the completion handler is called twice on a Next tap.
  it('dismisses and forwards only on the non-Next arm', () => {
    const arm = actionGuardElseArm(methodBody(read(CONTENT_SWIFT), '_ response: UNNotificationResponse'));

    expect(arm).toContain('completion(.dismissAndForwardAction)');
  });
});

describe('NotificationViewController.didReceive unwired outlet log contents', () => {
  // The arm is the only signal an outlet came unwired, so the text and the severity are the
  // signal — a reworded or downgraded log is indistinguishable from silence in Console.
  it('names the unwired outlet in the logged message', () => {
    const body = methodBody(read(CONTENT_SWIFT), '_ response: UNNotificationResponse');
    const elseArm = body.slice(body.indexOf('} else {'));

    expect(elseArm).toContain('os_log("Next tapped with no carousel outlet"');
  });

  it('logs that message at error severity', () => {
    const body = methodBody(read(CONTENT_SWIFT), '_ response: UNNotificationResponse');
    const elseArm = body.slice(body.indexOf('} else {'));

    expect(elseArm).toContain('type: .error');
  });
});

const PODFILE = 'ios/Podfile';

/**
 * Returns one `target '…' do` block. A non-anchored slice to the next `end` stops at the `end` of
 * a nested `do`/`begin` block, so split on the target lines instead and keep the matching chunk.
 */
function podfileTarget(source: string, name: string): string {
  const chunk = source.split(/^target /m).find(part => part.startsWith(`'${name}' do`));

  expect(chunk).toBeDefined();

  return chunk!;
}

describe('podfileTarget', () => {
  it('returns only the requested target, not the whole file', () => {
    const fixture = [
      "target 'WithPin' do",
      '  pod "SomePod", "1.0.0"',
      'end',
      '',
      "target 'WithoutPin' do",
      'end',
      '',
    ].join('\n');

    expect(podfileTarget(fixture, 'WithoutPin')).not.toContain('SomePod');
  });
});

describe('InsiderMobileAdvancedNotification pin', () => {
  // Scope per target: a file-wide grep for the version passes with one of the two extensions
  // reverted, which builds the content and service extensions against different SDK versions.
  it.each(['InsiderNotificationContent', 'InsiderNotificationService'])(
    'target %s pins the exact SDK version',
    target => {
      expect(podfileTarget(read(PODFILE), target)).toContain(
        'pod "InsiderMobileAdvancedNotification", "2.4.0"',
      );
    },
  );
});
