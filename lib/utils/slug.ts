export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function uniqueSlug(base: string, used: Set<string>): string {
  const baseSlug = slugify(base);
  if (!used.has(baseSlug)) return baseSlug;
  let i = 2;
  while (used.has(`${baseSlug}-${i}`)) i++;
  return `${baseSlug}-${i}`;
}

