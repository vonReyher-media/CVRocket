import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function that combines clsx and tailwind-merge to conditionally
 * join class names together and resolve Tailwind CSS conflicts.
 *
 * @example
 * // Basic usage
 * cn("text-red-500", "bg-blue-500")
 * // => "text-red-500 bg-blue-500"
 *
 * @example
 * // With conditional classes
 * cn("text-white", isError && "bg-red-500", !isError && "bg-blue-500")
 * // => "text-white bg-red-500" or "text-white bg-blue-500"
 *
 * @example
 * // Resolving Tailwind conflicts
 * cn("px-2 py-1", "p-4")
 * // => "p-4" (tailwind-merge resolves the padding conflict)
 *
 * @param {...ClassValue[]} inputs - Class names, objects, or arrays of class names
 * @returns {string} - The merged class names string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
