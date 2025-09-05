import { readList, writeList, genId } from './fs';
import { files } from './paths';
import type { Tag } from '@/lib/types';

export async function getAllTags(): Promise<Tag[]> {
  const list = await readList<Tag>(files.tags);
  return list.sort((a, b) => a.name.localeCompare(b.name));
}

export async function createTag(name: string): Promise<Tag> {
  const list = await readList<Tag>(files.tags);
  const exists = list.find((t) => t.name.toLowerCase() === name.trim().toLowerCase());
  if (exists) return exists;
  const item: Tag = { id: genId('tag'), name: name.trim() };
  await writeList(files.tags, [...list, item]);
  return item;
}

