import fs from 'fs';
import path from 'path';

const REPO_ROOT = path.resolve(__dirname, '..');
const APP_GROUP = 'group.com.useinsider.reactnativedemo';

const FILES_DECLARING_APP_GROUP = [
  'App.tsx',
  'ios/ReactNativeDemo/ReactNativeDemo.entitlements',
  'ios/InsiderNotificationService/InsiderNotificationService.entitlements',
  'ios/InsiderNotificationContent/InsiderNotificationContent.entitlements',
  'ios/InsiderNotificationService/NotificationService.swift',
  'ios/InsiderNotificationContent/NotificationViewController.swift',
];

describe('app group identifier', () => {
  it.each(FILES_DECLARING_APP_GROUP)('%s declares only the demo app group', file => {
    const content = fs.readFileSync(path.join(REPO_ROOT, file), 'utf8');
    const groups = content.match(/group\.[A-Za-z0-9._-]+/g) ?? [];

    expect(groups.length).toBeGreaterThan(0);
    expect([...new Set(groups)]).toEqual([APP_GROUP]);
  });
});
