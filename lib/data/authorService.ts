import { readList, writeList, genId } from './fs';
import { files } from './paths';
import type { Author } from '@/lib/types';

export async function getAllAuthors(): Promise<Author[]> {
  const list = await readList<Author>(files.authors);
  return list.sort((a, b) => a.name.localeCompare(b.name));
}

export async function createAuthor(name: string, bio?: string): Promise<Author> {
  const list = await readList<Author>(files.authors);
  const exists = list.find((a) => a.name.toLowerCase() === name.trim().toLowerCase());
  if (exists) return exists;
  const item: Author = { id: genId('auth'), name: name.trim(), bio: bio?.trim() };
  await writeList(files.authors, [...list, item]);
  return item;
}

