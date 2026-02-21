/* eslint-disable @typescript-eslint/no-explicit-any */
import { geoPath, geoNaturalEarth1, type GeoProjection } from 'd3-geo';

export function createMapProjection(): GeoProjection {
  return geoNaturalEarth1()
    .scale(130)
    .translate([0, 0]);
}

export function generateSVGPath(
  feature: any,
  projection: GeoProjection
): string | null {
  const pathGenerator = geoPath().projection(projection);
  return pathGenerator(feature);
}