/**
 * Toolbar Component
 * 
 * Simple toolbar for canvas operations, providing mode selection
 * for creating objects vs. selecting/interacting with existing objects.
 */

import './Toolbar.css';

/**
 * Props for Toolbar component
 */
interface ToolbarProps {
  /** Whether creation mode is currently active */
  isCreating: boolean;
  /** Callback to toggle creation mode on/off */
  onToggleCreate: () => void;
}

/**
 * Toolbar for canvas operations
 * 
 * Displays buttons for switching between "select" and "create" modes.
 * In create mode, clicking the canvas creates a new rectangle.
 * In select mode, clicking selects existing objects.
 * 
 * @param props - Component props
 * @returns Toolbar element
 * 
 * @example
 * <Toolbar 
 *   isCreating={isCreatingMode}
 *   onToggleCreate={() => setIsCreatingMode(!isCreatingMode)}
 * />
 */
export function Toolbar({ isCreating, onToggleCreate }: ToolbarProps) {
  return (
    <div className="toolbar">
      <button 
        className={`toolbar-btn ${isCreating ? 'active' : ''}`}
        onClick={onToggleCreate}
        title={isCreating ? 'Cancel creation' : 'Create rectangle'}
      >
        {isCreating ? 'Cancel' : '+ Add Rectangle'}
      </button>
    </div>
  );
}

