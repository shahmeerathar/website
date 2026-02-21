import { existsSync } from 'node:fs';
import { join } from 'node:path';
import locationsData from '../src/data/locations.json' with { type: 'json' };
import photosData from '../src/data/photos.json' with { type: 'json' };

const imageDir = join(process.cwd(), 'public', 'images', 'photos');
const imageDirExists = existsSync(imageDir);

const errors = [];

for (const photo of photosData) {
  if (photo.src.startsWith('..') || photo.src.startsWith('/')) {
    errors.push(`Photo "${photo.id}" src "${photo.src}" must not use absolute or parent-relative paths`);
  } else if (!imageDirExists || !existsSync(join(imageDir, photo.src))) {
    errors.push(`Photo "${photo.id}" src "${photo.src}" does not exist in public/images/photos/`);
  }
}

if (errors.length > 0) {
  console.error('Photo file validation failed:\n' + errors.map(e => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('✓ All photo files exist');