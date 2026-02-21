import type { APIRoute } from 'astro';
import { getAllLocations } from '../lib/data';

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error('Astro site URL is required to generate sitemap-index.xml');
  }

  const urls = [
    new URL('/', site).toString(),
    new URL('/about/', site).toString(),
    ...getAllLocations().map((location) => new URL(`/location/${location.slug}/`, site).toString()),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => `  <url><loc>${url}</loc></url>`)
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
