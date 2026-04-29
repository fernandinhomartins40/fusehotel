type PublicSetting = {
  key?: string;
  value?: unknown;
};

export interface BrandTheme {
  browserTitle: string;
  favicon: string;
  logo: string;
  footerLogo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export const BRAND_THEME_COLORS = {
  primary: 'hsl(var(--primary))',
  primaryHover: 'hsl(var(--primary-hover))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  primaryForeground: 'hsl(var(--primary-foreground))',
  secondaryForeground: 'hsl(var(--secondary-foreground))',
  accentForeground: 'hsl(var(--accent-foreground))',
  foreground: 'hsl(var(--foreground))',
} as const;

const DEFAULT_THEME: BrandTheme = {
  browserTitle: 'Aguas Claras',
  favicon: '/favicon.ico',
  logo: '',
  footerLogo: '',
  primaryColor: '#1A1F2C',
  secondaryColor: '#6E59A5',
  accentColor: '#9b87f5',
};

function getSettingValue(settings: PublicSetting[] | undefined, key: string) {
  const value = settings?.find((setting) => setting.key === key)?.value;

  return typeof value === 'string' && value.trim() ? value : undefined;
}

function normalizeAssetUrl(value: string | undefined) {
  if (!value) {
    return '';
  }

  const trimmed = value.trim();

  if (typeof window === 'undefined' || window.location.protocol !== 'https:') {
    return trimmed;
  }

  if (trimmed.startsWith('http://')) {
    return `https://${trimmed.slice('http://'.length)}`;
  }

  return trimmed;
}

function normalizeHex(hex: string) {
  if (!hex) {
    return null;
  }

  const value = hex.trim().replace(/^#/, '');

  if (value.length === 3) {
    return value
      .split('')
      .map((char) => `${char}${char}`)
      .join('');
  }

  if (value.length === 6) {
    return value;
  }

  return null;
}

function hexToRgb(hex: string) {
  const normalized = normalizeHex(hex);

  if (!normalized) {
    return null;
  }

  const parsed = Number.parseInt(normalized, 16);
  const r = (parsed >> 16) & 255;
  const g = (parsed >> 8) & 255;
  const b = parsed & 255;

  return { r, g, b };
}

function rgbToHslTriplet(r: number, g: number, b: number, lightnessAdjustment = 0) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = Math.max(0, Math.min(1, (max + min) / 2 + lightnessAdjustment));

  if (max === min) {
    return `0 0% ${Math.round(lightness * 100)}%`;
  }

  const delta = max - min;
  const saturation =
    lightness > 0.5
      ? delta / (2 - max - min)
      : delta / (max + min);

  let hue = 0;

  switch (max) {
    case red:
      hue = (green - blue) / delta + (green < blue ? 6 : 0);
      break;
    case green:
      hue = (blue - red) / delta + 2;
      break;
    default:
      hue = (red - green) / delta + 4;
      break;
  }

  hue *= 60;

  return `${Math.round(hue * 10) / 10} ${Math.round(saturation * 1000) / 10}% ${Math.round(lightness * 1000) / 10}%`;
}

function hexToHslTriplet(
  hex: string,
  fallback = '222.2 84% 4.9%',
  lightnessAdjustment = 0
) {
  const rgb = hexToRgb(hex);

  if (!rgb) {
    return fallback;
  }

  return rgbToHslTriplet(rgb.r, rgb.g, rgb.b, lightnessAdjustment);
}

function getAccessibleForeground(hex: string) {
  const rgb = hexToRgb(hex);

  if (!rgb) {
    return '0 0% 100%';
  }

  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  return luminance > 0.65 ? '222.2 47.4% 11.2%' : '0 0% 100%';
}

const LEGACY_BRAND_COLOR_MAP: Record<string, string> = {
  '#0466c8': BRAND_THEME_COLORS.primary,
  '#0354a8': BRAND_THEME_COLORS.primaryHover,
  '#0355a6': BRAND_THEME_COLORS.primaryHover,
  '#6e59a5': BRAND_THEME_COLORS.secondary,
  '#9b87f5': BRAND_THEME_COLORS.accent,
};

function normalizeLegacyBrandColor(value: string) {
  const normalized = value.trim().toLowerCase();

  return LEGACY_BRAND_COLOR_MAP[normalized] || value;
}

export function buildBrandTheme(
  settings: PublicSetting[] | undefined,
  headerBrowserTitle?: string
): BrandTheme {
  return {
    ...DEFAULT_THEME,
    browserTitle: headerBrowserTitle?.trim() || DEFAULT_THEME.browserTitle,
    favicon: normalizeAssetUrl(getSettingValue(settings, 'branding_favicon')) || DEFAULT_THEME.favicon,
    logo: normalizeAssetUrl(getSettingValue(settings, 'branding_logo')) || DEFAULT_THEME.logo,
    footerLogo: normalizeAssetUrl(getSettingValue(settings, 'branding_footerLogo')) || DEFAULT_THEME.footerLogo,
    primaryColor: getSettingValue(settings, 'branding_primaryColor') || DEFAULT_THEME.primaryColor,
    secondaryColor:
      getSettingValue(settings, 'branding_secondaryColor') || DEFAULT_THEME.secondaryColor,
    accentColor: getSettingValue(settings, 'branding_accentColor') || DEFAULT_THEME.accentColor,
  };
}

export function applyBrandThemeVariables(theme: BrandTheme) {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;

  root.style.setProperty('--primary', hexToHslTriplet(theme.primaryColor));
  root.style.setProperty('--primary-hover', hexToHslTriplet(theme.primaryColor, undefined, -0.08));
  root.style.setProperty('--primary-foreground', getAccessibleForeground(theme.primaryColor));
  root.style.setProperty('--secondary', hexToHslTriplet(theme.secondaryColor));
  root.style.setProperty('--secondary-foreground', getAccessibleForeground(theme.secondaryColor));
  root.style.setProperty('--accent', hexToHslTriplet(theme.accentColor));
  root.style.setProperty('--accent-foreground', getAccessibleForeground(theme.accentColor));
  root.style.setProperty('--ring', hexToHslTriplet(theme.primaryColor));
  root.style.setProperty('--sidebar-primary', hexToHslTriplet(theme.primaryColor));
  root.style.setProperty('--sidebar-primary-foreground', getAccessibleForeground(theme.primaryColor));
  root.style.setProperty('--sidebar-ring', hexToHslTriplet(theme.primaryColor));
}

export function hydrateBrandColors<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => hydrateBrandColors(item)) as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        hydrateBrandColors(entry),
      ])
    ) as T;
  }

  if (typeof value === 'string') {
    return normalizeLegacyBrandColor(value) as T;
  }

  return value;
}

export function resolveHeroColor(
  value: string | undefined,
  fallback = BRAND_THEME_COLORS.secondary
) {
  if (!value) {
    return fallback;
  }

  const normalized = normalizeLegacyBrandColor(value);
  const lowered = normalized.trim().toLowerCase();

  if (
    lowered === BRAND_THEME_COLORS.primary.toLowerCase() ||
    lowered.includes('gradient') ||
    lowered.includes('url(')
  ) {
    return fallback;
  }

  return normalized;
}

export function colorWithAlpha(color: string | undefined, alpha: number, fallback = BRAND_THEME_COLORS.primary) {
  const resolvedColor = color || fallback;

  const hslVarMatch = resolvedColor.match(/^hsl\(var\((--[^)]+)\)\)$/);

  if (hslVarMatch) {
    return `hsl(var(${hslVarMatch[1]}) / ${alpha})`;
  }

  const rgb = hexToRgb(resolvedColor);

  if (rgb) {
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  }

  return resolvedColor;
}
