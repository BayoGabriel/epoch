import LoadingSpinner from '@/components/shared/LoadingSpinner';
import React from 'react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}