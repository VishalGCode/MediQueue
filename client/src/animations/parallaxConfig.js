export const parallaxConfig = {
  hero: {
    bgSpeed: [0, 150],
    midSpeed: [0, 80],
    frontSpeed: [0, 30],
    textSpeed: [0, -60],
    fadeRange: [0, 300],
    scaleRange: [1, 1.1],
  },
  section: {
    speed: 0.5,
    triggerMargin: '-100px',
    threshold: 0.3,
  },
  card: {
    tiltIntensity: 20,
    perspective: 800,
    hoverScale: 1.05,
    tapScale: 0.97,
  },
  floating: {
    yRange: [-20, 20],
    durationRange: [4, 9],
    delayRange: [0, 3],
  },
  spring: {
    default: { stiffness: 100, damping: 30 },
    smooth: { stiffness: 80, damping: 20 },
    snappy: { stiffness: 260, damping: 20 },
    cursor: { stiffness: 150, damping: 20 },
  },
};

export default parallaxConfig;
