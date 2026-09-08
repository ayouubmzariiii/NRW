// Build favicon files from the original WordPress icon (Group-505.png), so the
// browser tab shows exactly the same mark as the old site.
import sharp from 'sharp';
import fs from 'node:fs';

const SRC = '.migrate-cache/icon.png';
if (!fs.existsSync(SRC)) throw new Error(`missing ${SRC} – download Group-505.png first`);

const mark = await sharp(SRC).trim().toBuffer();

/** Square PNG of the mark, no padding, transparent background. */
async function square(size) {
  return sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: await sharp(mark).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer(), gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

await fs.promises.writeFile('public/icon.png', await square(64));
await fs.promises.writeFile('public/icon-512.png', await square(512));
// Apple touch icons must not be transparent – put the mark on the brand's off-white.
const appleInner = await sharp(mark).resize(150, 150, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
  .composite([{ input: appleInner, gravity: 'centre' }])
  .png({ compressionLevel: 9 })
  .toFile('public/apple-icon.png');

/** Minimal .ico container with embedded PNGs (supported by every current browser). */
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => square(s)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(sizes.length, 4);
let offset = 6 + sizes.length * 16;
const entries = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s === 256 ? 0 : s, 0);
  e.writeUInt8(s === 256 ? 0 : s, 1);
  e.writeUInt8(0, 2); // palette
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // colour planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return e;
});
fs.writeFileSync('app/favicon.ico', Buffer.concat([header, ...entries, ...pngs]));

console.log('favicons written:', sizes.map((s, i) => `${s}px ${pngs[i].length}B`).join(', '));
