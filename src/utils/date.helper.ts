export function formatDate(input: string | Date): string {
  if (!input) {
    return 'Present';
  }

  const date = new Date(input);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  // Format date as "Jan, 2020"
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}
