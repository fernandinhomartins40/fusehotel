import { useEffect } from 'react';
import { useLandingSettings } from '@/hooks/useLanding';
import { usePublicSettings } from '@/hooks/useSystemSettings';
import { defaultHeaderConfig } from '@/types/landing-config';

const DEFAULT_BROWSER_TITLE = defaultHeaderConfig.browserTitle || 'Aguas Claras';
const DEFAULT_FAVICON = '/favicon.ico';

type PublicSetting = {
  key?: string;
  value?: unknown;
};

function getPublicSettingValue(settings: PublicSetting[] | undefined, key: string) {
  const value = settings?.find((setting) => setting.key === key)?.value;

  return typeof value === 'string' && value.trim() ? value : undefined;
}

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

  const browserTitle = headerSettings?.config?.browserTitle || DEFAULT_BROWSER_TITLE;
  const favicon =
    getPublicSettingValue(publicSettings as PublicSetting[] | undefined, 'branding_favicon') ||
    DEFAULT_FAVICON;

  useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  useEffect(() => {
    upsertHeadLink('icon', favicon);
    upsertHeadLink('shortcut icon', favicon);
    upsertHeadLink('apple-touch-icon', favicon);
  }, [favicon]);

  return null;
};
