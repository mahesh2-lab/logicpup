import React, { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'motion/react';

interface MagneticWrapperProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // Distance multiplier for magnetic pull (default: 0.35)
  radius?: number; // Activation distance in px (default: 180)
  enableTilt?: boolean;
  style?: React.CSSProperties;
  id?: string;
}

export const MagneticWrapper: React.FC<MagneticWrapperProps> = ({
  children,
  className = '',
  strength = 0.35,
  radius = 200,
  enableTilt = false,
  style = {},
  id,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring smoothed motion values for fluid organic magnetic drift
  const springConfig = { damping: 18, stiffness: 180, mass: 0.2 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Subtle 3D tilt calculations if enabled
  const rotateX = useTransform(smoothY, [-40, 40], [5, -5]);
  const rotateY = useTransform(smoothX, [-40, 40], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.hypot(distanceX, distanceY);

    if (distance < radius) {
      // Pull proportional to distance with cubic dampening
      const pullFactor = Math.max(0, 1 - distance / radius);
      mouseX.set(distanceX * strength * (1 + pullFactor * 0.5));
      mouseY.set(distanceY * strength * (1 + pullFactor * 0.5));
    } else {
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      id={id}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        x: smoothX,
        y: smoothY,
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
        transformStyle: 'preserve-3d',
        ...style,
      }}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};
