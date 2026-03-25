'use client';

import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden animate-pulse">
      {/* Image block */}
      <div className="w-full aspect-[4/3] bg-surface2/50" />
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-surface2 rounded w-3/4" />
          <div className="h-3 bg-surface2/60 rounded w-1/2" />
        </div>

        {/* Prices */}
        <div className="space-y-2 mt-4">
          <div className="h-3 bg-surface2/60 rounded w-1/3" />
          <div className="flex gap-2">
            <div className="h-4 bg-surface2/40 rounded w-12" />
            <div className="h-4 bg-surface2/40 rounded w-12" />
            <div className="h-4 bg-surface2/40 rounded w-12" />
          </div>
          <div className="h-8 bg-surface2 rounded w-1/2 mt-2" />
        </div>

        {/* Button */}
        <div className="h-10 bg-surface2/80 rounded mt-4" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
