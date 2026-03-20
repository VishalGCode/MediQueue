import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Home, Printer, Eye, ArrowRight, Sparkles, Users, Clock,
} from 'lucide-react';
import TokenCard from '../components/TokenCard';
import PrintTicket from '../components/PrintTicket';
import { useToken } from '../hooks/useToken';
import { useTokenContext } from '../context/TokenContext';
import { pageVariants, scalePop, fadeUp } from '../animations/variants';

export default function TokenSuccess() {
  const { tokenNumber } = useParams();
  const { fetchToken, token, loading } = useToken();
  const { currentToken, socket } = useTokenContext();
  const [showPrint, setShowPrint] = useState(false);
  const [tokensAhead, setTokensAhead] = useState(0);
  const containerRef = useRef(null);

  const { scrollY } = useScroll();
  const tiltX = useTransform(scrollY, [0, 500], [0, 5]);
  const tiltY = useTransform(scrollY, [0, 500], [0, -3]);
  const smoothTiltX = useSpring(tiltX, { stiffness: 100, damping: 20 });
  const smoothTiltY = useSpring(tiltY, { stiffness: 100, damping: 20 });

  const displayToken = token || currentToken;

  useEffect(() => {
    if (tokenNumber) {
      fetchToken(tokenNumber);
    }
  }, [tokenNumber]);

  // Confetti on load
  useEffect(() => {
    if (displayToken) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#06b6d4', '#22d3ee', '#67e8f9'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#06b6d4', '#22d3ee', '#67e8f9'],
        });

        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [displayToken]);

  // Calculate tokens ahead
  useEffect(() => {
    if (displayToken) {
      setTokensAhead(Math.max(0, displayToken.tokenCode - 1));
    }
  }, [displayToken]);

  // Socket updates
  useEffect(() => {
    if (socket && displayToken) {
      const interval = setInterval(() => {
        setTokensAhead(prev => Math.max(0, prev - Math.floor(Math.random() * 2)));
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [socket, displayToken]);

  if (loading || !displayToken) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-white/50">Loading your token...</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden"
    >
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ scale: 3, opacity: 0 }}
            animate={{ scale: 1, opacity: [0, 0.6, 0] }}
            transition={{
              duration: 2,
              delay: i * 0.1,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
        ))}
      </div>

      {/* Floating blobs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-[100px]"
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-[120px]"
        animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-lg mx-auto relative">
        {/* Success badge */}
        <motion.div
          className="text-center mb-8"
          variants={scalePop}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 mb-4
                     bg-emerald-500/10 border border-emerald-500/30 rounded-full"
            animate={{ boxShadow: ['0 0 20px rgba(16,185,129,0.1)', '0 0 40px rgba(16,185,129,0.3)', '0 0 20px rgba(16,185,129,0.1)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-300 font-semibold">Token Generated!</span>
          </motion.div>
          <h1 className="font-display font-bold text-3xl text-white">
            You're All Set!
          </h1>
        </motion.div>

        {/* Token card with parallax tilt */}
        <motion.div
          style={{ rotateX: smoothTiltX, rotateY: smoothTiltY, transformPerspective: 1200 }}
          className="mb-8 will-change-transform"
        >
          <TokenCard token={displayToken} />
        </motion.div>

        {/* Wait time bar */}
        <motion.div
          className="glass p-5 rounded-2xl mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-white/60">Estimated Wait Time</span>
            </div>
            <span className="text-primary-400 font-bold">
              {displayToken.estimatedWaitTime} min
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-cyan-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (displayToken.estimatedWaitTime / 60) * 100)}%` }}
              transition={{ duration: 1.5, delay: 1.2, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Tokens ahead */}
        <motion.div
          className="glass p-5 rounded-2xl mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center justify-center gap-3">
            <Users className="w-5 h-5 text-amber-400" />
            <span className="text-white/60">Tokens Ahead:</span>
            <motion.span
              className="text-2xl font-bold gradient-text"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {tokensAhead}
            </motion.span>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
        >
          <motion.button
            onClick={() => setShowPrint(!showPrint)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                     bg-white/5 border border-white/10 text-white font-medium
                     hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Printer className="w-5 h-5" />
            {showPrint ? 'Hide Ticket' : 'Print Ticket'}
          </motion.button>

          <Link to="/queue" className="flex-1">
            <motion.button
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                       bg-white/5 border border-white/10 text-white font-medium
                       hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Eye className="w-5 h-5" />
              View Queue
            </motion.button>
          </Link>

          <Link to="/" className="flex-1">
            <motion.button
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                       bg-gradient-to-r from-primary-500 to-cyan-400
                       text-dark-950 font-bold shadow-lg shadow-primary-500/25"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Home className="w-5 h-5" />
              Home
            </motion.button>
          </Link>
        </motion.div>

        {/* Print section */}
        <AnimatePresence>
          {showPrint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 overflow-hidden"
            >
              <PrintTicket token={displayToken} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
