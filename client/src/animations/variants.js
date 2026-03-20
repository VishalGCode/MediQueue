// Page transitions
export const pageVariants = {
  initial: { opacity: 0, y: 40, filter: 'blur(8px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -40,
    filter: 'blur(8px)',
    transition: { duration: 0.4 },
  },
};

// Stagger children container
export const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

// Fade up (used on all cards and sections)
export const fadeUp = {
  initial: { opacity: 0, y: 60 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

// Fade in from left
export const fadeLeft = {
  initial: { opacity: 0, x: -80 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

// Fade in from right
export const fadeRight = {
  initial: { opacity: 0, x: 80 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

// Scale pop (for token reveal)
export const scalePop = {
  initial: { scale: 0, rotate: -10, opacity: 0 },
  animate: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
};

// Flip card (for ticket reveal)
export const flipCard = {
  initial: { rotateY: 180, opacity: 0 },
  animate: {
    rotateY: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

// Number counter animation (for stats)
export const numberCount = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 200 },
  },
};

// Slide in from right (form steps)
export const slideRight = {
  enter: { x: 300, opacity: 0, filter: 'blur(4px)' },
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    x: -300,
    opacity: 0,
    filter: 'blur(4px)',
    transition: { duration: 0.3 },
  },
};

// Spring shake (for errors)
export const shakeX = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 },
  },
};

// Navbar variants
export const navVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
};
