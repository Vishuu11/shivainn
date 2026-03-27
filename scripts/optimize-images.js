// optimize-images.js
// Usage:
// 1. npm init -y
// 2. npm install sharp
// 3. node scripts/optimize-images.js
// This script reads JPG/PNG files from assets/images/gallery and writes
// resized copies to assets/images/optimized with suffixes -640, -1024, -1920.

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const INPUT_DIR = path.resolve(__dirname, '..', 'assets', 'images', 'gallery');
const OUTPUT_DIR = path.resolve(__dirname, '..', 'assets', 'images', 'optimized');
const SIZES = [640, 1024, 1920];

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;
  const name = path.basename(file, ext);
  const inputPath = path.join(INPUT_DIR, file);

  for (const size of SIZES) {
    const outName = `${name}-${size}${ext}`;
    const outPath = path.join(OUTPUT_DIR, outName);
    try {
      await sharp(inputPath).resize({ width: size }).withMetadata().toFile(outPath);
      console.log('Written', outPath);
    } catch (err) {
      console.error('Error processing', inputPath, err);
    }
  }
}

(async function main(){
  const files = fs.readdirSync(INPUT_DIR);
  for (const f of files) await processFile(f);
  console.log('Done. Resized images are in', OUTPUT_DIR);
})();
