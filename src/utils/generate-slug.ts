export function generateSlug(input: string): string {
  const lowercaseInput = input.toLowerCase();
  const words = lowercaseInput.split(/\W+/);
  const slug = words.join('-');
  return slug;
}
