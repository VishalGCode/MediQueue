import { useScroll, useTransform, useSpring } from 'framer-motion';

export function useParallax(ref, outputRange, springConfig) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const raw = useTransform(scrollYProgress, [0, 1], outputRange);

  return useSpring(raw, springConfig || { stiffness: 100, damping: 30 });
}

export function useScrollProgress() {
  const { scrollYProgress } = useScroll();
  return useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
}

export default useParallax;
