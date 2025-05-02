"use client";

// components/Image3D.tsx
import React, { useRef, useState, useEffect } from "react";
import { Image } from "@heroui/image";

// Animation Parameters for fluid motion
const ANIMATION_PARAMS = {
  TILT_THRESHOLD: 15,
  SCALE_FACTOR: 0.95,
  HOVER_DURATION: 0.1,
  EXIT_DURATION: 0.8,
  TIMING_FUNCTION: "cubic-bezier(0.22, 1, 0.36, 1)",
};

interface Image3DProps {
  src: string;
  alt: string;
  className?: string;
  id?: string;
}

const Image3D: React.FC<Image3DProps> = ({
  src,
  alt,
  className,
  id,
}) => {
  // References
  const imageRef = useRef<HTMLDivElement>(null);

  // State for transform and transition
  const [transform, setTransform] = useState(
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
  );

  const [transition, setTransition] = useState(
    `transform ${ANIMATION_PARAMS.EXIT_DURATION}s ${ANIMATION_PARAMS.TIMING_FUNCTION}`
  );

  // Check if user prefers reduced motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    // Add event listener for changes to motion preference
    mediaQuery.addEventListener("change", handleMediaChange);

    // Clean up
    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !imageRef.current) return;

    const { clientX, clientY } = e;
    const { clientWidth, clientHeight } = imageRef.current;
    const { left: offsetLeft, top: offsetTop } =
      imageRef.current.getBoundingClientRect();

    // Calculate horizontal and vertical position (0 to 1)
    const horizontal = (clientX - offsetLeft) / clientWidth;
    const vertical = (clientY - offsetTop) / clientHeight;

    // Calculate rotation values with optimized fluid animation
    const rotateX = (
      ANIMATION_PARAMS.TILT_THRESHOLD / 2 -
      horizontal * ANIMATION_PARAMS.TILT_THRESHOLD
    ).toFixed(2);
    const rotateY = (
      vertical * ANIMATION_PARAMS.TILT_THRESHOLD -
      ANIMATION_PARAMS.TILT_THRESHOLD / 2
    ).toFixed(2);

    // Set a faster transition for movement
    setTransition(
      `transform ${ANIMATION_PARAMS.HOVER_DURATION}s ${ANIMATION_PARAMS.TIMING_FUNCTION}`
    );

    // Apply the 3D transform with optimized scale factor
    setTransform(
      `perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(${ANIMATION_PARAMS.SCALE_FACTOR}, ${ANIMATION_PARAMS.SCALE_FACTOR}, ${ANIMATION_PARAMS.SCALE_FACTOR})`
    );
  };

  // Reset styles when mouse leaves with smoother exit
  const handleMouseLeave = () => {
    setTransition(
      `transform ${ANIMATION_PARAMS.EXIT_DURATION}s ${ANIMATION_PARAMS.TIMING_FUNCTION}`
    );
    setTransform(
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
    );
  };

  // Combined base classes with the provided className
  const baseClassName = "transform rounded-xl shadow-2xl";
  const combinedClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  return (
    <div
      className="relative"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
        touchAction: "none", // Prevents touch scrolling issues
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={imageRef}
    >
      <Image
        id={id}
        src={src}
        alt={alt}
        className={combinedClassName}
        style={{
          transform: transform,
          transition: transition,
          transformStyle: "preserve-3d",
          willChange: "transform",
          backfaceVisibility: "hidden", // Prevents flickering in some browsers
        }}
      />
    </div>
  );
};

export default Image3D;
