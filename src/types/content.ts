export interface Location {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  region: string;
  country: string;
  description: string;
  heroPhotoId: string;
}

export interface Photo {
  id: string;
  locationSlug: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  takenAt: string;
  tags: string[];
  featured: boolean;
  sortOrder: number;
}

export interface MapPinView {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  photoCount: number;
  heroSrc: string;
}