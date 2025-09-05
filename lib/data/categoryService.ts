import { readList, writeList, genId } from './fs';
import { files } from './paths';
import type { Category } from '@/lib/types';

export async function getAllCategories(): Promise<Category[]> {
  const list = await readList<Category>(files.categories);
  return list.sort((a, b) => a.name.localeCompare(b.name));
}

export async function createCategory(name: string): Promise<Category> {
  const list = await readList<Category>(files.categories);
  const exists = list.find((c) => c.name.toLowerCase() === name.trim().toLowerCase());
  if (exists) return exists;
  const item: Category = { id: genId('cat'), name: name.trim() };
  await writeList(files.categories, [...list, item]);
  return item;
}

