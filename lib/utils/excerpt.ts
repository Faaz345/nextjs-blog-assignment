export function excerpt(content: string, words = 30): string {
  const tokens = content.trim().split(/\s+/);
  const slice = tokens.slice(0, words).join(' ');
  return tokens.length > words ? `${slice}…` : slice;
}

