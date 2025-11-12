import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdir } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '../data');

async function ensureDataDir() {
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
}

export async function readJSON(filename) {
  await ensureDataDir();
  const filePath = join(dataDir, filename);
  
  if (!existsSync(filePath)) {
    await writeFile(filePath, JSON.stringify([], null, 2));
    return [];
  }
  
  const data = await readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export async function writeJSON(filename, data) {
  await ensureDataDir();
  const filePath = join(dataDir, filename);
  await writeFile(filePath, JSON.stringify(data, null, 2));
}

export function getNextId(items) {
  if (items.length === 0) return 1;
  return Math.max(...items.map(item => item.id)) + 1;
}
