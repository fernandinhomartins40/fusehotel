import { useEffect, useMemo } from 'react';
import { useLandingSettings } from '@/hooks/useLanding';
import { usePublicSettings } from '@/hooks/useSystemSettings';
import { defaultHeaderConfig } from '@/types/landing-config';
import { applyBrandThemeVariables, buildBrandTheme } from '@/lib/brand-theme';

const DEFAULT_BROWSER_TITLE = defaultHeaderConfig.browserTitle || 'Aguas Claras';
const DEFAULT_FAVICON = '/favicon.ico';

function guessIconType(url: string) {
  if (url.endsWith('.svg')) {
    return 'image/svg+xml';
  }

  if (url.endsWith('.png')) {
    return 'image/png';
  }

  if (url.endsWith('.jpg') || url.endsWith('.jpeg')) {
    return 'image/jpeg';
  }

  if (url.endsWith('.webp')) {
    return 'image/webp';
  }

  return 'image/x-icon';
}

function upsertHeadLink(rel: string, href: string) {
  const existingLink = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  const link = existingLink || document.createElement('link');

  link.rel = rel;
  link.href = href;
  link.type = guessIconType(href);

  if (!existingLink) {
    document.head.appendChild(link);
  }
}

export const BrowserBranding = () => {
  const { data: headerSettings } = useLandingSettings('header');
  const { data: publicSettings } = usePublicSettings();

  const brandTheme = useMemo(
    () =>
      buildBrandTheme(
        publicSettings as { key?: string; value?: unknown }[] | undefined,
        headerSettings?.config?.browserTitle || DEFAULT_BROWSER_TITLE
      ),
    [headerSettings?.config?.browserTitle, publicSettings]
  );
  const browserTitle = brandTheme.browserTitle;
  const favicon = brandTheme.favicon || DEFAULT_FAVICON;

  useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  useEffect(() => {
    upsertHeadLink('icon', favicon);
    upsertHeadLink('shortcut icon', favicon);
    upsertHeadLink('apple-touch-icon', favicon);
  }, [favicon]);

  useEffect(() => {
    applyBrandThemeVariables(brandTheme);
  }, [brandTheme]);

  return null;
};
