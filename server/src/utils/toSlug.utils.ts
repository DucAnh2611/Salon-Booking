import slugify from 'slugify';

export function toSlug(text: string) {
    return slugify(text, {
        lower: true, // Convert to lowercase
        strict: true, // Remove special characters
        locale: 'en',
    });
}
