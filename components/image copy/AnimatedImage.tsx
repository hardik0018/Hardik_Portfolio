'use client';

import { StaticImageData } from 'next/image';
import EmergingImage from './EmergingImage';

export type AnimationType =
  | 'pixelize-slide' // type 0 - Pixelize with slide-in animation
  | 'wave-reveal' // type 1 - Wave reveal from top
  | 'pixel-dissolve' // type 2 - Pixel dissolve effect
  | 'curtain' // type 3 - Curtain reveal effect
  | 'pixelate'; // type 4 - Simple pixelate reveal

interface AnimatedImageProps {
  src: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  containerClassName?: string;
  animationType?: AnimationType;
  fillColor?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  borderRadius?: number;
}

// Map animation type names to numeric values
const animationTypeMap: Record<AnimationType, number> = {
  'pixelize-slide': 0,
  'wave-reveal': 1,
  'pixel-dissolve': 2,
  curtain: 3,
  pixelate: 4,
};

export default function AnimatedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  containerClassName = '',
  animationType = 'pixelize-slide',
  fillColor = '#FFFFFF',
  style,
  borderRadius = 8,
}: AnimatedImageProps) {
  // Convert StaticImageData to string URL
  const imageUrl = typeof src === 'string' ? src : src.src;

  // Calculate aspect ratio for non-fill images
  const aspectRatio = width && height ? width / height : undefined;

  const containerStyle: React.CSSProperties = fill
    ? {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }
    : {
        position: 'relative',
        width: width ? `${width}px` : '100%',
        aspectRatio: aspectRatio || 'auto',
        ...style,
      };

  return (
    <div className={`animated-image-container ${containerClassName}`} style={containerStyle}>
      <EmergingImage
        url={imageUrl}
        type={animationTypeMap[animationType]}
        fillColor={fillColor}
        className={`${className} absolute inset-0 h-full w-full`}
        style={{ width: '100%', height: '100%' }}
        borderRadius={borderRadius}
      />
    </div>
  );
}
