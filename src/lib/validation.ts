import type { Location, Photo } from '../types/content';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function validateLocation(location: Location, photoIds: Set<string>): ValidationResult {
  const errors: string[] = [];

  if (!location.slug || typeof location.slug !== 'string') {
    errors.push(`Location missing or invalid slug`);
  } else if (!SLUG_REGEX.test(location.slug)) {
    errors.push(`Location slug "${location.slug}" must be lowercase kebab-case`);
  }

  if (!location.name || typeof location.name !== 'string' || location.name.trim() === '') {
    errors.push(`Location with slug "${location.slug}" missing or invalid name`);
  }

  if (typeof location.lat !== 'number' || location.lat < -90 || location.lat > 90) {
    errors.push(`Location "${location.slug}" lat must be number between -90 and 90`);
  }

  if (typeof location.lng !== 'number' || location.lng < -180 || location.lng > 180) {
    errors.push(`Location "${location.slug}" lng must be number between -180 and 180`);
  }

  if (!location.region || typeof location.region !== 'string') {
    errors.push(`Location "${location.slug}" missing region`);
  }

  if (!location.country || typeof location.country !== 'string') {
    errors.push(`Location "${location.slug}" missing country`);
  }

  if (!location.description || typeof location.description !== 'string') {
    errors.push(`Location "${location.slug}" missing description`);
  }

  if (!location.heroPhotoId || typeof location.heroPhotoId !== 'string') {
    errors.push(`Location "${location.slug}" missing heroPhotoId`);
  } else if (!photoIds.has(location.heroPhotoId)) {
    errors.push(`Location "${location.slug}" heroPhotoId "${location.heroPhotoId}" does not exist in photos`);
  }

  return { valid: errors.length === 0, errors };
}

function validatePhoto(photo: Photo, locationSlugs: Set<string>): ValidationResult {
  const errors: string[] = [];

  if (!photo.id || typeof photo.id !== 'string') {
    errors.push(`Photo missing or invalid id`);
  }

  if (!photo.locationSlug || typeof photo.locationSlug !== 'string') {
    errors.push(`Photo with id "${photo.id}" missing locationSlug`);
  } else if (!locationSlugs.has(photo.locationSlug)) {
    errors.push(`Photo "${photo.id}" locationSlug "${photo.locationSlug}" does not exist in locations`);
  }

  if (!photo.src || typeof photo.src !== 'string') {
    errors.push(`Photo "${photo.id}" missing src`);
  } else if (!photo.src.endsWith('.jpg') && !photo.src.endsWith('.jpeg') && !photo.src.endsWith('.png')) {
    errors.push(`Photo "${photo.id}" src "${photo.src}" must be jpg, jpeg, or png`);
  }

  if (typeof photo.width !== 'number' || photo.width <= 0) {
    errors.push(`Photo "${photo.id}" width must be positive number`);
  }

  if (typeof photo.height !== 'number' || photo.height <= 0) {
    errors.push(`Photo "${photo.id}" height must be positive number`);
  }

  if (!photo.alt || typeof photo.alt !== 'string' || photo.alt.trim() === '') {
    errors.push(`Photo "${photo.id}" alt must be non-empty string`);
  }

  if (!photo.takenAt || typeof photo.takenAt !== 'string') {
    errors.push(`Photo "${photo.id}" missing takenAt`);
  } else {
    const date = new Date(photo.takenAt);
    if (isNaN(date.getTime())) {
      errors.push(`Photo "${photo.id}" takenAt "${photo.takenAt}" is not valid ISO date`);
    }
  }

  if (!Array.isArray(photo.tags)) {
    errors.push(`Photo "${photo.id}" tags must be array`);
  }

  if (typeof photo.featured !== 'boolean') {
    errors.push(`Photo "${photo.id}" featured must be boolean`);
  }

  if (typeof photo.sortOrder !== 'number' || photo.sortOrder < 0) {
    errors.push(`Photo "${photo.id}" sortOrder must be non-negative number`);
  }

  return { valid: errors.length === 0, errors };
}

export function validateLocations(locations: Location[], photoIds: Set<string>): void {
  const slugs = new Set<string>();
  const allErrors: string[] = [];

  for (const location of locations) {
    if (slugs.has(location.slug)) {
      allErrors.push(`Duplicate location slug: "${location.slug}"`);
      continue;
    }
    slugs.add(location.slug);

    const result = validateLocation(location, photoIds);
    if (!result.valid) {
      allErrors.push(...result.errors);
    }
  }

  if (allErrors.length > 0) {
    throw new Error(`Location validation failed:\n${allErrors.map(e => `  - ${e}`).join('\n')}`);
  }
}

export function validatePhotos(photos: Photo[], locationSlugs: Set<string>): void {
  const ids = new Set<string>();
  const allErrors: string[] = [];
  const imageDir = join(process.cwd(), 'public', 'images', 'photos');
  const imageDirExists = existsSync(imageDir);

  for (const photo of photos) {
    if (ids.has(photo.id)) {
      allErrors.push(`Duplicate photo id: "${photo.id}"`);
      continue;
    }
    ids.add(photo.id);

    const result = validatePhoto(photo, locationSlugs);
    if (!result.valid) {
      allErrors.push(...result.errors);
    }

    if (photo.src.startsWith('..') || photo.src.startsWith('/')) {
      allErrors.push(`Photo "${photo.id}" src "${photo.src}" must not use absolute or parent-relative paths`);
    } else {
      const imagePath = join(imageDir, photo.src);
      if (!imageDirExists || !existsSync(imagePath)) {
        allErrors.push(`Photo "${photo.id}" src "${photo.src}" does not exist in public/images/photos/`);
      }
    }
  }

  if (allErrors.length > 0) {
    throw new Error(`Photo validation failed:\n${allErrors.map(e => `  - ${e}`).join('\n')}`);
  }
}

export function validateCrossReferences(locations: Location[], photos: Photo[]): void {
  const locationSlugs = new Set(locations.map(l => l.slug));
  const photoIds = new Set(photos.map(p => p.id));
  const allErrors: string[] = [];

  for (const photo of photos) {
    if (!locationSlugs.has(photo.locationSlug)) {
      allErrors.push(`Photo "${photo.id}" references non-existent location slug "${photo.locationSlug}"`);
    }
  }

  for (const location of locations) {
    if (!photoIds.has(location.heroPhotoId)) {
      allErrors.push(`Location "${location.slug}" references non-existent heroPhotoId "${location.heroPhotoId}"`);
    }
  }

  if (allErrors.length > 0) {
    throw new Error(`Cross-reference validation failed:\n${allErrors.map(e => `  - ${e}`).join('\n')}`);
  }
}