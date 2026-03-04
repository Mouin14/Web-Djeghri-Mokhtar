import React, { memo } from 'react';

/**
 * Full-page loading spinner — memoized so it never re-renders.
 */
const LoadingSpinner = memo(() => (
    <div className="min-h-screen bg-brand-surface-light dark:bg-brand-surface-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
    </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';
export default LoadingSpinner;
