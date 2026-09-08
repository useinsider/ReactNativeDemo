import fs from 'fs';
import path from 'path';
import { colors, typography } from '../src/theme';

const REPO_ROOT = path.resolve(__dirname, '..');
const THEME_DIR = path.join(REPO_ROOT, 'src', 'theme');
const SKIPPED_DIRS = ['node_modules', 'ios', 'android', 'vendor', '.git', 'docs', '__tests__'];

function collectSourceFiles(dir: string, found: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIPPED_DIRS.includes(entry.name)) continue;
      collectSourceFiles(fullPath, found);
    } else if (/\.tsx?$/.test(entry.name) && !fullPath.startsWith(THEME_DIR)) {
      found.push(fullPath);
    }
  }
  return found;
}

describe('theme tokens', () => {
  it('exposes the nine insider colours plus white and black', () => {
    expect(colors).toEqual({
      navy: '#1B1F3B',
      navyDark: '#0E1027',
      orange: '#FF5C35',
      orangeDark: '#E5491F',
      surface: '#F7F8FC',
      surfaceVariant: '#EDEFF7',
      onSurface: '#1B1F3B',
      onSurfaceVariant: '#5B6075',
      outline: '#D6DAE8',
      white: '#FFFFFF',
      black: '#000000',
    });
  });

  it('uses the Kufam family for every text style', () => {
    for (const style of Object.values(typography)) {
      expect(style.fontFamily).toMatch(/^Kufam-(Medium|SemiBold)$/);
    }
  });

  it('leaves no hex literal outside src/theme', () => {
    const offenders = collectSourceFiles(REPO_ROOT)
      .filter(file => /#[0-9A-Fa-f]{3,8}\b/.test(fs.readFileSync(file, 'utf8')))
      .map(file => path.relative(REPO_ROOT, file));

    expect(offenders).toEqual([]);
  });

  it('leaves no useColorScheme call in the app', () => {
    const offenders = collectSourceFiles(REPO_ROOT)
      .filter(file => fs.readFileSync(file, 'utf8').includes('useColorScheme'))
      .map(file => path.relative(REPO_ROOT, file));

    expect(offenders).toEqual([]);
  });

  it('registers both Kufam font files with iOS in Info.plist', () => {
    const plistPath = path.join(REPO_ROOT, 'ios', 'ReactNativeDemo', 'Info.plist');
    const plist = fs.readFileSync(plistPath, 'utf8');
    const appFontsMatch = plist.match(/<key>UIAppFonts<\/key>\s*<array>([\s\S]*?)<\/array>/);

    expect(appFontsMatch).not.toBeNull();
    const appFontsBlock = appFontsMatch![1];

    expect(appFontsBlock).toContain('Kufam-Medium.ttf');
    expect(appFontsBlock).toContain('Kufam-SemiBold.ttf');
  });

  it('registers both Kufam font files with Android as raw assets', () => {
    const androidFontsDir = path.join(REPO_ROOT, 'android', 'app', 'src', 'main', 'assets', 'fonts');
    const files = fs.readdirSync(androidFontsDir);

    expect(files).toContain('Kufam-Medium.ttf');
    expect(files).toContain('Kufam-SemiBold.ttf');
  });

  it('keeps both Kufam font files in the source assets directory', () => {
    const assetsFontsDir = path.join(REPO_ROOT, 'assets', 'fonts');
    const files = fs.readdirSync(assetsFontsDir);

    expect(files).toContain('Kufam-Medium.ttf');
    expect(files).toContain('Kufam-SemiBold.ttf');
  });
});
