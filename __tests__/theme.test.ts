import fs from 'fs';
import os from 'os';
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
    } else if (/\.(t|j)sx?$/.test(entry.name) && !fullPath.startsWith(THEME_DIR)) {
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

  it('exposes the four text styles with their exact families and sizes', () => {
    expect(typography).toEqual({
      title: { fontFamily: 'Kufam-SemiBold', fontSize: 24 },
      body: { fontFamily: 'Kufam-Medium', fontSize: 15 },
      button: { fontFamily: 'Kufam-SemiBold', fontSize: 14 },
      caption: { fontFamily: 'Kufam-Medium', fontSize: 12 },
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
});

describe('collectSourceFiles', () => {
  it('sweeps plain JavaScript files at the repository root', () => {
    const swept = collectSourceFiles(REPO_ROOT).map(file => path.relative(REPO_ROOT, file));

    expect(swept).toContain('react-native.config.js');
    expect(swept).toContain('index.js');
    expect(swept).toContain('babel.config.js');
    expect(swept).toContain('metro.config.js');
  });

  it('returns a non-empty set for the repository, so the guard sweeps are not vacuous', () => {
    expect(collectSourceFiles(REPO_ROOT).length).toBeGreaterThan(0);
  });

  it('flags a planted hex literal in a js file', () => {
    const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'theme-sweep-'));
    fs.writeFileSync(path.join(fixtureDir, 'planted.js'), 'const c = "#FF00FF";\n');

    const offenders = collectSourceFiles(fixtureDir)
      .filter(file => /#[0-9A-Fa-f]{3,8}\b/.test(fs.readFileSync(file, 'utf8')))
      .map(file => path.basename(file));

    expect(offenders).toEqual(['planted.js']);
  });

  it('flags a planted useColorScheme call in a tsx file', () => {
    const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'theme-sweep-'));
    fs.writeFileSync(path.join(fixtureDir, 'planted.tsx'), 'const s = useColorScheme();\n');

    const offenders = collectSourceFiles(fixtureDir)
      .filter(file => fs.readFileSync(file, 'utf8').includes('useColorScheme'))
      .map(file => path.basename(file));

    expect(offenders).toEqual(['planted.tsx']);
  });
});
