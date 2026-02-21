import type { APIRoute } from 'astro';
import { getAllLocations, getPhotosByLocation } from '../lib/data';

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error('Astro site URL is required to generate feed.xml');
  }

  const locations = getAllLocations();
  const items = locations.map((location) => {
    const photos = getPhotosByLocation(location.slug);
    const latestPhotoDate = photos
      .map((photo) => new Date(photo.takenAt))
      .sort((a, b) => b.getTime() - a.getTime())[0];
    const pubDate = latestPhotoDate?.toUTCString() ?? new Date().toUTCString();
    const link = new URL(`/location/${location.slug}/`, site).toString();

    return `
    <item>
      <title><![CDATA[${location.name}]]></title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${location.description}]]></description>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Shahmeer Athar | Landscape &amp; Travel Photography</title>
    <link>${new URL('/', site).toString()}</link>
    <description>Landscape and travel photography portfolio by Shahmeer Athar.</description>
    ${items.join('\n')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
