export function deepEqual<T>(a: T, b: T): boolean {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a == null || b == null)
    return false;

  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    const keyTyped = key as keyof T;
    if (
      !Object.prototype.hasOwnProperty.call(b, key) ||
      !deepEqual(a[keyTyped], b[keyTyped])
    ) {
      return false;
    }
  }

  return true;
}
