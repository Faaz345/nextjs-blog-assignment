import fs from 'fs/promises';
import { files } from './paths';

export async function readList<T>(filePath: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as T[];
    return [] as T[];
  } catch (err: any) {
    if (err?.code === 'ENOENT') return [] as T[];
    throw err;
  }
}

export async function writeList<T>(filePath: string, list: T[]): Promise<void> {
  const json = JSON.stringify(list, null, 2) + '\n';
  await fs.mkdir(filePath.substring(0, filePath.lastIndexOf('/')), { recursive: true }).catch(() => {});
  await fs.writeFile(filePath, json, 'utf-8');
}

export function genId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

