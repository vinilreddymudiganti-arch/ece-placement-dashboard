import React from 'react';

// Glassmorphic Card component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export const Card = ({ children, className = '', hoverable = true, ...props }: CardProps) => {
  return (
    <div
      className={`glass-panel rounded-2xl p-5 ${
        hoverable ? 'glass-panel-hover' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Elegant Badge component
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'blue' | 'purple' | 'pink' | 'green' | 'orange' | 'gray';
}

export const Badge = ({ children, variant = 'gray', className = '', ...props }: BadgeProps) => {
  const styles = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    gray: 'bg-white/5 text-gray-300 border-white/10',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// Premium Progress Bar component
interface ProgressBarProps {
  value: number; // 0 to 100
  color?: string; // Tailwind class
  height?: string;
}

export const ProgressBar = ({ value, color = 'bg-gradient-to-r from-blue-500 to-purple-600', height = 'h-2' }: ProgressBarProps) => {
  const percentage = Math.min(Math.max(value, 0), 100);
  return (
    <div className={`w-full bg-white/5 rounded-full ${height} overflow-hidden border border-white/5`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// Custom Dialog Component using native HTML5 dialog element
interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Dialog = ({ isOpen, onClose, title, children }: DialogProps) => {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      // Prevent double showModal
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onClose}
      className="glass-panel text-white rounded-2xl p-6 max-w-md w-full backdrop:backdrop-blur-md backdrop:bg-black/60 outline-none border border-white/10 shadow-2xl open:animate-fade-in"
      style={{
        margin: 'auto',
        background: 'rgba(15, 23, 42, 0.95)',
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {title}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg"
          aria-label="Close dialog"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div>{children}</div>
    </dialog>
  );
};
