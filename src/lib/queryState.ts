import { getMapPins } from './data';

const QUERY_PARAM = 'location';

export function updateQueryLocation(locationSlug: string): void {
  const url = new URL(window.location.href);
  url.searchParams.set(QUERY_PARAM, locationSlug);
  window.history.replaceState(null, '', url.toString());
}

export function clearQueryLocation(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete(QUERY_PARAM);
  window.history.replaceState(null, '', url.toString());
}

export function getActiveLocationSlug(urlString: string): string | null {
  const url = new URL(urlString);
  return url.searchParams.get(QUERY_PARAM);
}

export function isValidLocationSlug(slug: string | null): slug is string {
  if (!slug || typeof slug !== 'string') return false;

  const pins = getMapPins();
  return pins.some(pin => pin.slug === slug);
}

export function getInitialActiveSlug(urlString: string): string | null {
  const slug = getActiveLocationSlug(urlString);
  if (isValidLocationSlug(slug)) {
    return slug;
  }
  return null;
}

export function syncLocationQuery(slug: string | null): void {
  const url = new URL(window.location.href);
  if (slug && isValidLocationSlug(slug)) {
    url.searchParams.set(QUERY_PARAM, slug);
  } else {
    url.searchParams.delete(QUERY_PARAM);
  }
  window.history.replaceState(null, '', url.toString());
}