import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useParallax } from '../hooks/useParallax';
import { staggerContainer, fadeUp } from '../animations/variants';

export default function ParallaxCards({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const parallaxY = useParallax(ref, [30, -30]);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{ y: parallaxY }}
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-50px' }}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div
          key={i}
          variants={fadeUp}
          custom={i}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
