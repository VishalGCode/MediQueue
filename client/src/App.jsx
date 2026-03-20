import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring, useMotionValue } from 'framer-motion';
import Navbar from './components/Navbar';
import Background3D from './components/Background3D';
import { useTokenContext } from './context/TokenContext';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const BookToken = lazy(() => import('./pages/BookToken'));
const TokenSuccess = lazy(() => import('./pages/TokenSuccess'));
const Queue = lazy(() => import('./pages/Queue'));
const Admin = lazy(() => import('./pages/Admin'));

// Scroll progress indicator
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: 'left' }}
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-cyan-300
               z-[100] shadow-lg shadow-cyan-400/50"
    />
  );
}

// Custom cursor follower
function CursorFollower() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 150, damping: 20 });
  const springY = useSpring(cursorY, { stiffness: 150, damping: 20 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    window.addEventListener('mousemove', moveCursor);

    // Detect hoverable elements
    const addHoverListeners = () => {
      const elements = document.querySelectorAll('button, a, [role="button"], input, select, textarea');
      elements.forEach(el => {
        el.addEventListener('mouseenter', handleHoverStart);
        el.addEventListener('mouseleave', handleHoverEnd);
      });
    };

    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-primary-400 pointer-events-none z-[200] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{ scale: isHovering ? 0.5 : 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      />
      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border-2 pointer-events-none z-[200]"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovering ? 50 : 30,
          height: isHovering ? 50 : 30,
          borderColor: isHovering ? 'rgba(34, 211, 238, 0.6)' : 'rgba(6, 182, 212, 0.4)',
        }}
        animate={{
          scale: isHovering ? 1.2 : 1,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      />
    </>
  );
}

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="w-12 h-12 border-3 border-primary-400 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-white/40 text-sm font-medium">Loading...</p>
      </motion.div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const { isMobile } = useTokenContext();

  return (
    <div className="relative">
      {/* 3D Background */}
      <Background3D />

      {/* Scroll progress */}
      <ScrollProgress />

      {/* Custom cursor (desktop only) */}
      {!isMobile && <CursorFollower />}

      {/* Navbar */}
      <Navbar />

      {/* Routes with AnimatePresence */}
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<BookToken />} />
            <Route path="/token/:tokenNumber" element={<TokenSuccess />} />
            <Route path="/queue" element={<Queue />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  );
}
