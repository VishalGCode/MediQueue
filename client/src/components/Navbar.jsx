import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Activity, Menu, X } from 'lucide-react';
import { navVariants } from '../animations/variants';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Book Token', path: '/book' },
  { name: 'Queue', path: '/queue' },
  { name: 'Admin', path: '/admin' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const { scrollY } = useScroll();

  const navBgOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const smoothBg = useSpring(navBgOpacity, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate={hidden ? 'hidden' : 'visible'}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
      >
        <motion.div
          className="absolute inset-0 border-b border-white/10"
          style={{
            opacity: smoothBg,
            backgroundColor: 'rgba(2, 6, 23, 0.85)',
            backdropFilter: 'blur(20px)',
          }}
        />

        <div className="relative max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-cyan-300
                              flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <Activity className="w-5 h-5 text-dark-950" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary-400 to-cyan-300
                              opacity-30 blur-sm -z-10" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                <span className="text-white">Medi</span>
                <span className="gradient-text">Queue</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <motion.div
                  className="relative px-4 py-2 rounded-lg text-sm font-medium
                           text-white/70 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-2 right-2 h-0.5
                               bg-gradient-to-r from-primary-400 to-cyan-300 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <Link to="/book" className="hidden md:block">
            <motion.button
              className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-cyan-400
                       text-dark-950 text-sm font-bold rounded-xl
                       shadow-lg shadow-primary-500/25"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(6,182,212,0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              Book Now
            </motion.button>
          </Link>

          {/* Mobile Toggle */}
          <motion.button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-72 z-[60] bg-dark-950/95 backdrop-blur-2xl
                     border-l border-white/10 p-6 pt-20 flex flex-col gap-2"
          >
            {navLinks.map((link, i) => (
              <Link key={link.path} to={link.path}>
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`px-4 py-3 rounded-xl text-lg font-medium transition-colors
                    ${location.pathname === link.path
                      ? 'bg-primary-500/20 text-primary-300'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                >
                  {link.name}
                </motion.div>
              </Link>
            ))}
            <Link to="/book" className="mt-4">
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-full py-3 bg-gradient-to-r from-primary-500 to-cyan-400
                         text-dark-950 font-bold rounded-xl"
              >
                Book Token Now
              </motion.button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
