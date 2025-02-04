'use client';

export default function LoadingSpinner({ fullScreen = false }) {
  const spinnerClasses = fullScreen 
    ? "min-h-screen flex items-center justify-center"
    : "flex items-center justify-center py-8";

  return (
    <div className={spinnerClasses}>
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
