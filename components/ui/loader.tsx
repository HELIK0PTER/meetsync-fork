import React from "react";

export default function Loader({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className="animate-spin rounded-full border-4 border-t-transparent border-violet-500"
        style={{ width: size, height: size }}
      />
    </div>
  );
} 