/**
 * Generate URL-friendly slug from text
 */
export const generateSlug = (text: string): string => {
  return text
    .toString()
    .normalize('NFD') // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
};

/**
 * Generate unique slug by appending number if needed
 */
export const generateUniqueSlug = async (
  baseText: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> => {
  let slug = generateSlug(baseText);
  let counter = 1;

  while (await checkExists(slug)) {
    slug = `${generateSlug(baseText)}-${counter}`;
    counter++;
  }

  return slug;
};
