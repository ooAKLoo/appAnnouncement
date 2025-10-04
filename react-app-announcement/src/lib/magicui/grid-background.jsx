import React from "react";

export function GridBackground({ className = "", gridColor = "#e4e4e7", gridSize = 40 }) {
  return (
    <div className="absolute inset-0">
      <div
        className={`absolute inset-0 ${className}`}
        style={{
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
          maskImage: 'radial-gradient(circle at center, white 0%, transparent 60%)',
          WebkitMaskImage: 'radial-gradient(circle at center, white 0%, transparent 60%)',
        }}
      />
    </div>
  );
}
