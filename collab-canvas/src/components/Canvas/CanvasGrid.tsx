/**
 * CanvasGrid Component
 * 
 * Renders a Figma-style adaptive grid overlay on the canvas that scales with zoom.
 * Provides visual feedback for zoom level and clearly marks canvas boundaries.
 * Uses a two-level grid system (major/minor) that adapts based on zoom level.
 */

import { Group, Line, Rect } from 'react-konva';
import type { ViewportState } from '../../types/canvas.types';
import { getVisibleGridLines, getAdaptiveGridSize } from '../../utils/canvas.utils';

/**
 * Props for the CanvasGrid component
 */
interface CanvasGridProps {
  /** Total width of the canvas in pixels */
  width: number;
  /** Total height of the canvas in pixels */
  height: number;
  /** Current viewport state (pan position and zoom level) */
  viewport: ViewportState;
}

/**
 * CanvasGrid component that renders a scalable grid overlay
 * 
 * Features:
 * - Two-level grid system (major and minor lines)
 * - Adaptive grid spacing based on zoom level
 * - Performance optimization: only renders visible lines
 * - Constant visual line thickness at all zoom levels
 * - Clear canvas boundary visualization
 * 
 * @param props - Grid properties including dimensions and viewport
 * 
 * @example
 * <Layer>
 *   <CanvasGrid 
 *     width={5000} 
 *     height={5000} 
 *     viewport={{ x: 0, y: 0, scale: 1 }}
 *   />
 * </Layer>
 */
export function CanvasGrid({ width, height, viewport }: CanvasGridProps) {
  const { minor: minorGridSize, major: majorGridSize } = getAdaptiveGridSize(viewport.scale);
  
  // Calculate visible grid lines for performance optimization
  const minorLines = minorGridSize 
    ? getVisibleGridLines(viewport, width, height, minorGridSize, window.innerWidth, window.innerHeight - 80)
    : null;
  
  const majorLines = getVisibleGridLines(
    viewport, 
    width, 
    height, 
    majorGridSize,
    window.innerWidth,
    window.innerHeight - 80
  );

  /**
   * Builds points array for Konva Line component
   * Format: [x1,y1,x2,y2, x3,y3,x4,y4, ...]
   */
  function buildGridLinePoints(
    verticalLines: number[],
    horizontalLines: number[],
    canvasWidth: number,
    canvasHeight: number
  ): number[] {
    const points: number[] = [];
    
    // Add vertical lines
    verticalLines.forEach(x => {
      points.push(x, 0, x, canvasHeight);
    });
    
    // Add horizontal lines
    horizontalLines.forEach(y => {
      points.push(0, y, canvasWidth, y);
    });
    
    return points;
  }

  return (
    <Group listening={false}>
      {/* Minor grid lines (shown at higher zoom levels) */}
      {minorLines && (
        <Line
          points={buildGridLinePoints(
            minorLines.vertical,
            minorLines.horizontal,
            width,
            height
          )}
          stroke="#e0e0e0"
          strokeWidth={1 / viewport.scale}
          listening={false}
          perfectDrawEnabled={false}
        />
      )}

      {/* Major grid lines (shown at most zoom levels) */}
      <Line
        points={buildGridLinePoints(
          majorLines.vertical,
          majorLines.horizontal,
          width,
          height
        )}
        stroke="#cccccc"
        strokeWidth={1.5 / viewport.scale}
        listening={false}
        perfectDrawEnabled={false}
      />

      {/* Canvas boundary rectangle */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        stroke="#999999"
        strokeWidth={3 / viewport.scale}
        listening={false}
        shadowColor="rgba(0, 0, 0, 0.1)"
        shadowBlur={4 / viewport.scale}
        shadowOffset={{ x: 0, y: 0 }}
        perfectDrawEnabled={false}
      />
    </Group>
  );
}

