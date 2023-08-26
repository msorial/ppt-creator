export const hasEmptyValues = (obj: any) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (Array.isArray(value) && value.length === 0) {
        return true; // Found an empty array
      } else if (typeof value === 'string' && value.trim() === '') {
        return true; // Found an empty string
      } else if (typeof value === 'object' && hasEmptyValues(value)) {
        return true; // Recursively check nested objects
      }
    }
  }
  return false; // No empty arrays or strings found
}