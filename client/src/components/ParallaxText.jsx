import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useAnimationFrame,
  useMotionValue,
} from 'framer-motion';
import { wrap } from 'framer-motion';

function MarqueeRow({ children, baseVelocity = 100 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [-1000, 1000], [-5, 5]);

  const directionFactor = useRef(1);

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v / 100)}%`);

  return (
    <div className="overflow-hidden whitespace-nowrap flex">
      <motion.div className="flex whitespace-nowrap gap-8" style={{ x }}>
        {[...Array(4)].map((_, i) => (
          <span key={i} className="inline-block">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function ParallaxText() {
  const text =
    'SKIP THE LINE • BOOK YOUR TOKEN • MEDIQUEUE • FAST HEALTHCARE • ZERO WAITING • YOUR HEALTH MATTERS • ';

  return (
    <section className="py-12 overflow-hidden">
      <MarqueeRow baseVelocity={-80}>
        <span className="text-5xl md:text-7xl font-display font-black neon-outline tracking-wider opacity-30">
          {text}
        </span>
      </MarqueeRow>
      <MarqueeRow baseVelocity={80}>
        <span className="text-5xl md:text-7xl font-display font-black gradient-text tracking-wider opacity-20">
          {text}
        </span>
      </MarqueeRow>
    </section>
  );
}
