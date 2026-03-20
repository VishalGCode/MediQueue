import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from '../animations/variants';
import AdminPanel from '../components/AdminPanel';

export default function Admin() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-24 pb-16 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <AdminPanel />
      </div>
    </motion.div>
  );
}
