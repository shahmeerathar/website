import { geoBounds, geoCentroid } from 'd3-geo';
import type { Feature } from 'geojson';
import type { BoundingBox, GeoCoordinate } from '../types/map';

export function calculateBoundingBox(features: Feature[]): BoundingBox | null {
  if (features.length === 0) return null;

  const allBounds = features.map(feature => geoBounds(feature));
  const minLat = Math.min(...allBounds.map(b => b[0][1]));
  const maxLat = Math.max(...allBounds.map(b => b[1][1]));
  const minLng = Math.min(...allBounds.map(b => b[0][0]));
  const maxLng = Math.max(...allBounds.map(b => b[1][0]));

  return { minLat, maxLat, minLng, maxLng };
}

export function calculateCentroid(feature: Feature): GeoCoordinate | null {
  const centroid = geoCentroid(feature);
  return { lat: centroid[1], lng: centroid[0] };
}

export function createViewBox(bounds: BoundingBox, paddingDegrees: number = 5): string {
  const minX = bounds.minLng - paddingDegrees;
  const maxX = bounds.maxLng + paddingDegrees;
  const minY = bounds.minLat - paddingDegrees;
  const maxY = bounds.maxLat + paddingDegrees;

  const width = maxX - minX;
  const height = maxY - minY;

  return `${minX} ${minY} ${width} ${height}`;
}