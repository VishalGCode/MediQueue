import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Clock } from 'lucide-react';
import FloatingElements from './FloatingElements';

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();

  // Multi-layer parallax speeds
  const bgY = useTransform(scrollY, [0, 500], [0, 150]);
  const midY = useTransform(scrollY, [0, 500], [0, 80]);
  const frontY = useTransform(scrollY, [0, 500], [0, 30]);
  const textY = useTransform(scrollY, [0, 500], [0, -60]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.1]);

  // Smooth springs
  const smoothBgY = useSpring(bgY, { stiffness: 80, damping: 20 });
  const smoothMidY = useSpring(midY, { stiffness: 80, damping: 20 });
  const smoothFrontY = useSpring(frontY, { stiffness: 80, damping: 20 });
  const smoothTextY = useSpring(textY, { stiffness: 80, damping: 20 });
  const smoothOpacity = useSpring(opacity, { stiffness: 80, damping: 20 });
  const smoothScale = useSpring(scale, { stiffness: 80, damping: 20 });

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Layer 1: Background gradient */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y: smoothBgY }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px]
                      bg-gradient-radial from-primary-500/20 via-primary-900/10 to-transparent
                      rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px]
                      bg-gradient-radial from-cyan-500/10 via-transparent to-transparent
                      rounded-full blur-3xl" />
      </motion.div>

      {/* Layer 2: Floating blurred blobs */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y: smoothMidY }}
      >
        <motion.div
          className="absolute top-20 left-[10%] w-72 h-72 bg-primary-500/20 rounded-full blur-[100px]"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-[15%] w-96 h-96 bg-cyan-400/15 rounded-full blur-[120px]"
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"
          animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Layer 3: Floating medical icons */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y: smoothFrontY }}
      >
        <FloatingElements />
      </motion.div>

      {/* Layer 4: Text content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-5xl mx-auto will-change-transform"
        style={{ y: smoothTextY, opacity: smoothOpacity, scale: smoothScale }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8
                   bg-primary-500/10 border border-primary-500/20 rounded-full"
        >
          <Zap className="w-4 h-4 text-primary-400" />
          <span className="text-sm text-primary-300 font-medium">Smart Hospital Token System</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-display font-black text-5xl md:text-7xl lg:text-8xl leading-tight mb-6"
        >
          <span className="block text-white">Skip The Line.</span>
          <span className="block gradient-text glow-text">
            Book Your Token.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Zero waiting, zero stress. Book your OPD token online and get real-time
          queue updates. Fast, free, and efficient healthcare management.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/book">
            <motion.button
              className="group flex items-center gap-3 px-8 py-4
                       bg-gradient-to-r from-primary-500 to-cyan-400
                       text-dark-950 font-bold text-lg rounded-2xl
                       shadow-2xl shadow-primary-500/30"
              whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(6,182,212,0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              Book Token Now
              <motion.span
                className="inline-block"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </motion.button>
          </Link>

          <Link to="/queue">
            <motion.button
              className="flex items-center gap-2 px-8 py-4
                       bg-white/5 border border-white/10 text-white font-semibold
                       text-lg rounded-2xl hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Live Queue
            </motion.button>
          </Link>
        </motion.div>

        {/* Features badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-16"
        >
          {[
            { icon: Clock, text: '< 5 Min Wait' },
            { icon: Shield, text: '100% Secure' },
            { icon: Zap, text: 'Instant Booking' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2 text-white/40"
              whileHover={{ color: 'rgba(6, 182, 212, 0.8)' }}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-3 rounded-full bg-primary-400"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
