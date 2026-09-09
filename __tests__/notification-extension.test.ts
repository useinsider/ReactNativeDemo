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

describe('NotificationService.didReceive', () => {
  it('never force-unwraps contentHandler or bestAttemptContent', () => {
    const offenders =
      read(SERVICE_SWIFT).match(/\b(contentHandler|bestAttemptContent)\s*!/g) ?? [];

    expect(offenders).toEqual([]);
  });

  it('unwraps both stored properties conditionally before calling back', () => {
    expect(read(SERVICE_SWIFT)).toContain('if let contentHandler, let bestAttemptContent');
  });
});
