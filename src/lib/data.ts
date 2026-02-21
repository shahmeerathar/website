import type { Location, Photo, MapPinView } from '../types/content';
import { validateLocations, validatePhotos, validateCrossReferences } from './validation';
import locationsData from '../data/locations.json' with { type: 'json' };
import photosData from '../data/photos.json' with { type: 'json' };

const locations: Location[] = locationsData as unknown as Location[];
const photos: Photo[] = photosData as unknown as Photo[];

const photoIdSet = new Set(photos.map(p => p.id));
validateLocations(locations, photoIdSet);

const locationSlugs = new Set(locations.map(l => l.slug));
validatePhotos(photos, locationSlugs);

validateCrossReferences(locations, photos);

const photosByLocation = new Map<string, Photo[]>();
for (const photo of photos) {
  if (!photosByLocation.has(photo.locationSlug)) {
    photosByLocation.set(photo.locationSlug, []);
  }
  photosByLocation.get(photo.locationSlug)!.push(photo);
}

for (const photoList of photosByLocation.values()) {
  photoList.sort((a, b) => a.sortOrder - b.sortOrder);
}

const mapPins: MapPinView[] = locations
  .map(location => {
    const locationPhotos = photosByLocation.get(location.slug) || [];
    const heroPhoto = locationPhotos.find(p => p.id === location.heroPhotoId) || locationPhotos[0];

    return {
      slug: location.slug,
      name: location.name,
      lat: location.lat,
      lng: location.lng,
      photoCount: locationPhotos.length,
      heroSrc: heroPhoto ? heroPhoto.src : ''
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

export function getAllLocations(): Location[] {
  return [...locations];
}

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find(location => location.slug === slug);
}

export function getPhotosByLocation(slug: string): Photo[] {
  return photosByLocation.get(slug) || [];
}

export function getMapPins(): MapPinView[] {
  return [...mapPins];
}