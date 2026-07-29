import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const svg = readFileSync(join(root, 'public/favicon.svg'))

const sizes = [192, 512]
for (const size of sizes) {
  const out = join(root, 'public', `pwa-${size}x${size}.png`)
  await sharp(svg).resize(size, size).png().toFile(out)
  console.log('wrote', out)
}
