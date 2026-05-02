export type CheckoutDraftContext = 'accommodation' | 'promotion';

export interface CheckoutDraft {
  context: CheckoutDraftContext;
  routePath: string;
  roomUnitId: string;
  accommodationId?: string;
  accommodationName: string;
  accommodationType: string;
  pricePerNight: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfExtraBeds: number;
  extraBedPrice: number;
  guestName: string;
  guestEmail: string;
  guestWhatsApp: string;
  promotionId?: string;
  promotionCode?: string;
  promotionTitle?: string;
  promotionDiscountPercent?: number | null;
  promotionOriginalPrice?: number | null;
  promotionDiscountedPrice?: number | null;
}

const CHECKOUT_DRAFT_KEY = 'fusehotel_checkout_draft';

export function readCheckoutDraft() {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawDraft = window.sessionStorage.getItem(CHECKOUT_DRAFT_KEY);
  if (!rawDraft) {
    return null;
  }

  try {
    return JSON.parse(rawDraft) as CheckoutDraft;
  } catch {
    window.sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
    return null;
  }
}

export function saveCheckoutDraft(draft: CheckoutDraft) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft));
}

export function clearCheckoutDraft() {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
}

export function getMatchingCheckoutDraft(routePath: string) {
  const draft = readCheckoutDraft();

  if (!draft || draft.routePath !== routePath) {
    return null;
  }

  return draft;
}
