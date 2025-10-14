/**
 * Color Utilities
 * 
 * This module provides color-related utility functions for the application,
 * including random color assignment for users in collaborative sessions.
 */

/**
 * Predefined palette of 12 distinct colors for user identification
 * Colors are carefully selected to be visually distinct and accessible
 */
const USER_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#85C1E2', // Sky Blue
  '#F8B739', // Orange
  '#52B788', // Green
  '#E63946', // Crimson
  '#457B9D', // Steel Blue
];

/**
 * Generates a random color from the predefined palette
 * 
 * Used to assign colors to users for cursors, presence indicators,
 * and other visual identification purposes.
 * 
 * @returns Hex color string (e.g., '#FF6B6B')
 * 
 * @example
 * const userColor = getRandomColor();
 * // Returns: '#4ECDC4' (or any other color from the palette)
 */
export function getRandomColor(): string {
  return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
}

/**
 * Gets the array of all available user colors
 * 
 * Useful for previews, color pickers, or other UI that needs
 * to display all available colors.
 * 
 * @returns Array of hex color strings
 */
export function getAllColors(): string[] {
  return [...USER_COLORS];
}

