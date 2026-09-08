// Slice a tall full-page screenshot into viewable chunks: node scripts/qa/slice.mjs <file> [scale] [chunkHeight]
import sharp from 'sharp';
import path from 'node:path';
const [file, scaleArg = '0.5', chunkArg = '2200'] = process.argv.slice(2);
const scale = Number(scaleArg), chunk = Number(chunkArg);
const img = sharp(file); const meta = await img.metadata();
const w = Math.round(meta.width * scale), h = Math.round(meta.height * scale);
const buf = await img.resize(w, h).png().toBuffer();
const base = file.replace(/\.png$/, '');
let i = 0;
for (let top = 0; top < h; top += chunk, i++) {
  const hh = Math.min(chunk, h - top);
  await sharp(buf).extract({ left: 0, top, width: w, height: hh }).png().toFile(`${base}-${i}.png`);
}
console.log(path.basename(base), 'slices', i, `${w}x${h}`);
