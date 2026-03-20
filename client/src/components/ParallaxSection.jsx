import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useParallax } from '../hooks/useParallax';
import { fadeUp, fadeLeft, fadeRight } from '../animations/variants';

export default function ParallaxSection({
  children,
  direction = 'up',
  delay = 0,
  bgParallax = true,
  className = '',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const parallaxY = useParallax(ref, [50, -50]);

  const variants = {
    up: fadeUp,
    left: fadeLeft,
    right: fadeRight,
  };

  const selectedVariant = variants[direction] || fadeUp;

  return (
    <motion.section
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-100px' }}
      variants={selectedVariant}
      transition={{ delay }}
    >
      {bgParallax && (
        <motion.div
          className="absolute inset-0 -z-10 will-change-transform"
          style={{ y: parallaxY }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-950/5 to-transparent" />
        </motion.div>
      )}
      {children}
    </motion.section>
  );
}
