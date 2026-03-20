import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Cross, Heart, Stethoscope, Pill, Syringe, Activity,
  Shield, Thermometer, Eye, Bone, Brain, Microscope,
} from 'lucide-react';

const icons = [
  { Icon: Cross, x: '5%', y: '15%', size: 28, duration: 5, delay: 0, color: '#06b6d4' },
  { Icon: Heart, x: '85%', y: '20%', size: 24, duration: 7, delay: 1, color: '#ef4444' },
  { Icon: Stethoscope, x: '15%', y: '70%', size: 32, duration: 6, delay: 0.5, color: '#22d3ee' },
  { Icon: Pill, x: '90%', y: '60%', size: 22, duration: 8, delay: 2, color: '#a78bfa' },
  { Icon: Syringe, x: '75%', y: '80%', size: 26, duration: 5.5, delay: 1.5, color: '#06b6d4' },
  { Icon: Activity, x: '30%', y: '85%', size: 30, duration: 9, delay: 0.8, color: '#34d399' },
  { Icon: Shield, x: '60%', y: '10%', size: 24, duration: 6.5, delay: 2.5, color: '#fbbf24' },
  { Icon: Thermometer, x: '45%', y: '90%', size: 20, duration: 7.5, delay: 1.2, color: '#f87171' },
  { Icon: Eye, x: '8%', y: '45%', size: 22, duration: 4.5, delay: 0.3, color: '#67e8f9' },
  { Icon: Bone, x: '92%', y: '40%', size: 28, duration: 8.5, delay: 3, color: '#d1d5db' },
  { Icon: Brain, x: '50%', y: '5%', size: 26, duration: 6, delay: 1.8, color: '#f472b6' },
  { Icon: Microscope, x: '20%', y: '30%', size: 24, duration: 7, delay: 0.7, color: '#06b6d4' },
];

function FloatingIcon({ Icon, x, y, size, duration, delay, color }) {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 1000], [0, Math.random() * 100 - 50]);

  return (
    <motion.div
      className="absolute will-change-transform"
      style={{ left: x, top: y, y: parallaxY }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.15, 0.35, 0.15],
        scale: 1,
        y: [-20, 20],
        rotate: [0, 360],
      }}
      transition={{
        opacity: { duration, repeat: Infinity, ease: 'easeInOut', delay },
        y: { duration, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay },
        rotate: { duration: duration * 3, repeat: Infinity, ease: 'linear', delay },
        scale: { duration: 0.8, delay: delay + 0.5 },
      }}
      whileHover={{ scale: 1.4, opacity: 0.8, filter: `drop-shadow(0 0 10px ${color})` }}
    >
      <Icon size={size} color={color} strokeWidth={1.5} />
    </motion.div>
  );
}

export default function FloatingElements() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {icons.map((props, i) => (
        <div key={i} className="pointer-events-auto">
          <FloatingIcon {...props} />
        </div>
      ))}
    </div>
  );
}
