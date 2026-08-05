export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/o‘|o’|o'/g, 'o')
    .replace(/g‘|g’|g'/g, 'g')
    .replace(/sh/g, 'sh')
    .replace(/ch/g, 'ch')
    .replace(/ya/g, 'ya')
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^a-z0-9\-]/g, '')    // Remove all non-word chars except -
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
}
