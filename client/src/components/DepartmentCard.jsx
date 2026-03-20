import React, { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useInView, animate } from 'framer-motion';
import {
  Stethoscope, Heart, Bone, Baby, Shield, Eye, Ear, Brain,
  Users, Clock, ChevronRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const iconMap = {
  Stethoscope, Heart, Bone, Baby, Shield, Eye, Ear, Brain,
};

function AnimatedCounter({ value, inView }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) {
      const controls = animate(0, value, {
        duration: 1.5,
        ease: 'easeOut',
        onUpdate: (v) => setDisplay(Math.round(v)),
      });
      return () => controls.stop();
    }
  }, [value, inView]);

  return <span>{display}</span>;
}

export default function DepartmentCard({ department, onClick }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true });
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(y * -20);
    rotateY.set(x * 20);
    setGlowPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, []);

  const IconComponent = iconMap[department.icon] || Stethoscope;

  return (
    <motion.div
      ref={cardRef}
      className="perspective-1000 cursor-pointer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onClick={() => onClick?.(department)}
    >
      <motion.div
        className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10
                 overflow-hidden group preserve-3d will-change-transform"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformPerspective: 800,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.05, z: 50 }}
        whileTap={{ scale: 0.97 }}
      >
        {/* Cursor-follow glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(6,182,212,0.15) 0%, transparent 60%)`,
          }}
        />

        {/* Gradient border on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity
                      bg-gradient-to-r from-primary-500/20 via-transparent to-cyan-400/20 -z-10 blur-sm" />

        {/* Icon */}
        <motion.div
          className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-cyan-400/20
                   flex items-center justify-center mb-4 border border-primary-500/20"
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <IconComponent className="w-7 h-7 text-primary-400" />
        </motion.div>

        {/* Department name */}
        <h3 className="font-display font-bold text-xl text-white mb-1 group-hover:text-primary-300 transition-colors">
          {department.name}
        </h3>

        <span className="text-xs font-mono text-white/30 tracking-widest mb-4 block">
          {department.code}
        </span>

        {/* Queue info */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-white/50">
            <Users className="w-4 h-4" />
            <span className="text-sm">
              <AnimatedCounter value={department.currentQueue} inView={isInView} /> in queue
            </span>
          </div>
          <div className="flex items-center gap-1 text-white/50">
            <Clock className="w-4 h-4" />
            <span className="text-sm">~{department.avgTimePerPatient}m</span>
          </div>
        </div>

        {/* Doctors */}
        <div className="mt-3 flex flex-wrap gap-1">
          {department.doctors?.filter(d => d.available).map((doc, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {doc.name}
            </span>
          ))}
        </div>

        {/* Arrow */}
        <motion.div
          className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronRight className="w-5 h-5 text-primary-400" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
