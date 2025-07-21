// Utility to generate unique, URL-safe slugs for opportunity titles
import Opportunity from '../models/opportunity.js';

/**
 * Converts a string to a URL-safe slug (lowercase, hyphens, no special chars)
 * and ensures uniqueness in the Opportunity collection.
 * @param {string} title - Opportunity title
 * @returns {Promise<string>} Unique slug
 */
export async function generateUniqueSlug(title) {
  // Basic slug: lowercase, replace spaces with hyphens, remove special chars
  let baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  let slug = baseSlug;
  let counter = 1;
  // Check for uniqueness in the database
  while (await Opportunity.exists({ slug })) {
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
  return slug;
}
