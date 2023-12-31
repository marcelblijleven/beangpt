import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function which merges tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Chunk an array into an array of array by the provided size
 * @param array {Array} the array to chunk into smaller chunks
 * @param size {number} the size of each chunk
 */
export function chunk<T>(array: T[], size: number): T[][] {
  return Array.from(
    { length: Math.ceil(array.length / size) },
    (_, index) => array.slice(index * size, (index + 1) * size)
  );
}