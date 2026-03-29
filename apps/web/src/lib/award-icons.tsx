import type { LucideProps, LucideIcon } from 'lucide-react';
import {
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  Gem,
  Leaf,
  Medal,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  UtensilsCrossed,
} from 'lucide-react';

export const DEFAULT_AWARD_ICON = 'trophy';

export const awardIconOptions = [
  { value: 'trophy', label: 'Trofeu', icon: Trophy },
  { value: 'award', label: 'Premiacao', icon: Award },
  { value: 'medal', label: 'Medalha', icon: Medal },
  { value: 'star', label: 'Estrela', icon: Star },
  { value: 'sparkles', label: 'Destaque', icon: Sparkles },
  { value: 'badge-check', label: 'Certificacao', icon: BadgeCheck },
  { value: 'shield-check', label: 'Confianca', icon: ShieldCheck },
  { value: 'leaf', label: 'Sustentabilidade', icon: Leaf },
  { value: 'utensils-crossed', label: 'Gastronomia', icon: UtensilsCrossed },
  { value: 'briefcase', label: 'Eventos', icon: Briefcase },
  { value: 'building-2', label: 'Hotelaria', icon: Building2 },
  { value: 'gem', label: 'Excelencia', icon: Gem },
] as const;

export type AwardIconValue = (typeof awardIconOptions)[number]['value'];

const awardIconMap: Record<AwardIconValue, LucideIcon> = Object.fromEntries(
  awardIconOptions.map((option) => [option.value, option.icon])
) as Record<AwardIconValue, LucideIcon>;

const legacyAwardIconMap: Record<string, AwardIconValue> = {
  '🏆': 'trophy',
  '🌟': 'star',
  '⭐': 'star',
  '🍽️': 'utensils-crossed',
  '🍽': 'utensils-crossed',
  '💼': 'briefcase',
  '🥇': 'medal',
  '🏅': 'medal',
  '✅': 'badge-check',
  '🛡️': 'shield-check',
  '🛡': 'shield-check',
  '🍃': 'leaf',
  '🌿': 'leaf',
  '✨': 'sparkles',
  '💎': 'gem',
};

export const resolveAwardIconValue = (value?: string | null): AwardIconValue | null => {
  if (!value) {
    return null;
  }

  if (value in awardIconMap) {
    return value as AwardIconValue;
  }

  return legacyAwardIconMap[value] || null;
};

export const getAwardIcon = (value?: string | null): LucideIcon | null => {
  const resolvedValue = resolveAwardIconValue(value);
  return resolvedValue ? awardIconMap[resolvedValue] : null;
};

type AwardIconProps = LucideProps & {
  value?: string | null;
  fallbackClassName?: string;
};

export const AwardIcon = ({ value, fallbackClassName, ...props }: AwardIconProps) => {
  const Icon = getAwardIcon(value);

  if (Icon) {
    return <Icon {...props} />;
  }

  if (!value) {
    return null;
  }

  return <span className={fallbackClassName ?? props.className}>{value}</span>;
};
