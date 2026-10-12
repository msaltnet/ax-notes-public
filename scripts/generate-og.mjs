import { fileURLToPath } from 'node:url';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { inflateSync } from 'node:zlib';

// FreeType/fontconfig expects desktop SFNT fonts rather than web WOFF files.
function unpackWoff(woff) {
  const count = woff.readUInt16BE(12);
  const sfnt = Buffer.alloc(woff.readUInt32BE(16));
  woff.copy(sfnt, 0, 4, 8);
  sfnt.writeUInt16BE(count, 4);
  const power = 2 ** Math.floor(Math.log2(count));
  sfnt.writeUInt16BE(power * 16, 6);
  sfnt.writeUInt16BE(Math.log2(power), 8);
  sfnt.writeUInt16BE(count * 16 - power * 16, 10);
  let offset = 12 + count * 16;
  for (let i = 0; i < count; i++) {
    const entry = 44 + i * 20;
    const record = 12 + i * 16;
    const start = woff.readUInt32BE(entry + 4);
    const compressed = woff.readUInt32BE(entry + 8);
    const length = woff.readUInt32BE(entry + 12);
    const data = woff.subarray(start, start + compressed);
    woff.copy(sfnt, record, entry, entry + 4);
    sfnt.writeUInt32BE(woff.readUInt32BE(entry + 16), record + 4);
    sfnt.writeUInt32BE(offset, record + 8);
    sfnt.writeUInt32BE(length, record + 12);
    (compressed < length ? inflateSync(data) : data).copy(sfnt, offset);
    offset += Math.ceil(length / 4) * 4;
  }
  return sfnt;
}

// Use the site's packaged fonts, independent of system fonts and font caches.
const source = fileURLToPath(new URL('../assets/og-source.svg', import.meta.url));
const output = fileURLToPath(new URL('../public/og.png', import.meta.url));
if (process.argv.includes('--render')) {
  const { default: sharp } = await import('sharp');
  await sharp(source).png().toFile(output);
  process.exit(0);
}
const temporary = await mkdtemp(join(tmpdir(), 'ax-notes-og-'));
const fonts = join(temporary, 'fonts');
await mkdir(fonts);
try {
  for (const [family, weights] of [['noto-serif-kr', [600]], ['ibm-plex-sans-kr', [400, 600]]]) {
    for (const weight of weights) {
      for (const subset of ['korean', 'latin']) {
        const filename = `${family}-${subset}-${weight}-normal.woff`;
        const woff = await readFile(fileURLToPath(new URL(`../node_modules/@fontsource/${family}/files/${filename}`, import.meta.url)));
        await writeFile(join(fonts, filename.replace('.woff', '.otf')), unpackWoff(woff));
      }
    }
  }
  const config = join(temporary, 'fonts.conf');
  const xmlPath = (path) => path.replaceAll('\\', '/').replaceAll('&', '&amp;');
  await writeFile(config, `<?xml version="1.0"?><fontconfig><dir>${xmlPath(fonts)}</dir><cachedir>${xmlPath(join(temporary, 'cache'))}</cachedir></fontconfig>`);
  // Native fontconfig on Windows reads its environment at process startup.
  const rendered = spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--render'], {
    env: { ...process.env, FONTCONFIG_FILE: config }, stdio: 'inherit',
  });
  if (rendered.error) throw rendered.error;
  if (rendered.status !== 0) throw new Error(`OG rendering failed (${rendered.status})`);
  console.log('Generated public/og.png (1200 × 630)');
} finally {
  await rm(temporary, { recursive: true, force: true });
}
