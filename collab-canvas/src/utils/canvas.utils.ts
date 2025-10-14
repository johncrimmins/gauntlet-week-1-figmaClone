/**
 * Canvas Utility Functions
 * 
 * Provides coordinate conversion utilities for transforming between
 * canvas coordinates and screen coordinates based on viewport state.
 */

import type { ViewportState } from '../types/canvas.types';

/**
 * Converts canvas coordinates to screen coordinates
 * 
 * Takes a position in canvas space and converts it to the corresponding
 * position on the screen, accounting for the current zoom and pan state.
 * 
 * Formula:
 * - screenX = canvasX * scale + stageX
 * - screenY = canvasY * scale + stageY
 * 
 * @param canvasX - X coordinate in canvas space
 * @param canvasY - Y coordinate in canvas space
 * @param viewport - Current viewport state (position and scale)
 * @returns Object containing screen x and y coordinates
 * 
 * @example
 * const viewport = { x: 100, y: 50, scale: 1.5 };
 * const screen = canvasToScreen(200, 100, viewport);
 * // screen.x = 200 * 1.5 + 100 = 400
 * // screen.y = 100 * 1.5 + 50 = 200
 */
export function canvasToScreen(
  canvasX: number,
  canvasY: number,
  viewport: ViewportState
): { x: number; y: number } {
  return {
    x: canvasX * viewport.scale + viewport.x,
    y: canvasY * viewport.scale + viewport.y,
  };
}

/**
 * Converts screen coordinates to canvas coordinates
 * 
 * Takes a position on the screen and converts it to the corresponding
 * position in canvas space, accounting for the current zoom and pan state.
 * 
 * Formula:
 * - canvasX = (screenX - stageX) / scale
 * - canvasY = (screenY - stageY) / scale
 * 
 * @param screenX - X coordinate in screen space
 * @param screenY - Y coordinate in screen space
 * @param viewport - Current viewport state (position and scale)
 * @returns Object containing canvas x and y coordinates
 * 
 * @example
 * const viewport = { x: 100, y: 50, scale: 1.5 };
 * const canvas = screenToCanvas(400, 200, viewport);
 * // canvas.x = (400 - 100) / 1.5 = 200
 * // canvas.y = (200 - 50) / 1.5 = 100
 */
export function screenToCanvas(
  screenX: number,
  screenY: number,
  viewport: ViewportState
): { x: number; y: number } {
  return {
    x: (screenX - viewport.x) / viewport.scale,
    y: (screenY - viewport.y) / viewport.scale,
  };
}

/**
 * Determines adaptive grid size based on zoom level
 * 
 * Implements Figma-style adaptive grid that adjusts spacing based on zoom:
 * - High zoom (≥0.5): Both minor (50px) and major (500px) grids
 * - Medium zoom (0.2-0.5): Major grid only (500px)
 * - Low zoom (0.1-0.2): Sparse major grid (1000px)
 * - Very low zoom (<0.1): No grid
 * 
 * @param scale - Current viewport zoom scale
 * @returns Object with minor and major grid sizes (null if hidden)
 * 
 * @example
 * const { minor, major } = getAdaptiveGridSize(1.5);
 * // { minor: 50, major: 500 }
 * 
 * const { minor, major } = getAdaptiveGridSize(0.3);
 * // { minor: null, major: 500 }
 */
export function getAdaptiveGridSize(scale: number): {
  minor: number | null;
  major: number;
} {
  if (scale >= 0.5) {
    // High zoom: show both minor and major grids
    return { minor: 50, major: 500 };
  } else if (scale >= 0.2) {
    // Medium zoom: show only major grid
    return { minor: null, major: 500 };
  } else if (scale >= 0.1) {
    // Low zoom: show sparse major grid
    return { minor: null, major: 1000 };
  } else {
    // Very low zoom: minimal grid
    return { minor: null, major: 2000 };
  }
}

/**
 * Calculates which grid lines are visible in the current viewport
 * 
 * Performance optimization that only returns grid lines within the visible
 * screen area, reducing rendering load. Uses viewport transformation to
 * determine visible canvas bounds.
 * 
 * @param viewport - Current viewport state (position and scale)
 * @param canvasWidth - Total width of the canvas
 * @param canvasHeight - Total height of the canvas
 * @param gridSize - Size of grid cells in pixels
 * @param viewportWidth - Width of the visible viewport
 * @param viewportHeight - Height of the visible viewport
 * @returns Object containing arrays of visible vertical and horizontal line positions
 * 
 * @example
 * const lines = getVisibleGridLines(
 *   { x: 100, y: 50, scale: 1 },
 *   5000, 5000, 50, 1920, 1000
 * );
 * // { vertical: [0, 50, 100, 150, ...], horizontal: [0, 50, 100, ...] }
 */
export function getVisibleGridLines(
  viewport: ViewportState,
  canvasWidth: number,
  canvasHeight: number,
  gridSize: number,
  viewportWidth: number,
  viewportHeight: number
): { vertical: number[]; horizontal: number[] } {
  // Calculate visible bounds in canvas coordinates
  const visibleLeft = Math.max(0, -viewport.x / viewport.scale);
  const visibleTop = Math.max(0, -viewport.y / viewport.scale);
  const visibleRight = Math.min(canvasWidth, (viewportWidth - viewport.x) / viewport.scale);
  const visibleBottom = Math.min(canvasHeight, (viewportHeight - viewport.y) / viewport.scale);

  // Calculate which grid lines fall within visible bounds
  const startX = Math.floor(visibleLeft / gridSize) * gridSize;
  const startY = Math.floor(visibleTop / gridSize) * gridSize;

  const vertical: number[] = [];
  const horizontal: number[] = [];

  // Generate vertical lines
  for (let x = startX; x <= visibleRight; x += gridSize) {
    if (x >= 0 && x <= canvasWidth) {
      vertical.push(x);
    }
  }

  // Generate horizontal lines
  for (let y = startY; y <= visibleBottom; y += gridSize) {
    if (y >= 0 && y <= canvasHeight) {
      horizontal.push(y);
    }
  }

  return { vertical, horizontal };
}


