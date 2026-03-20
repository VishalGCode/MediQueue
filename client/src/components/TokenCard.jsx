import React from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Clock, MapPin, User, Stethoscope, Hash } from 'lucide-react';

export default function TokenCard({ token, compact = false }) {
  if (!token) return null;

  const patient = token.patientId || {};
  const dept = token.departmentId || {};

  const statusColors = {
    waiting: 'from-amber-500 to-orange-500',
    'in-progress': 'from-blue-500 to-cyan-500',
    completed: 'from-emerald-500 to-green-500',
    missed: 'from-red-500 to-rose-500',
  };

  if (compact) {
    return (
      <motion.div
        className="glass p-4 rounded-xl flex items-center gap-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${statusColors[token.status]}
                      flex items-center justify-center text-white font-bold text-sm shrink-0`}>
          #{token.tokenCode}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">{patient.fullName}</p>
          <p className="text-sm text-white/40">{dept.name}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-lg font-medium
                       bg-gradient-to-r ${statusColors[token.status]} bg-clip-text text-transparent`}>
          {token.status}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative glass-strong rounded-3xl overflow-hidden max-w-md mx-auto"
      initial={{ rotateY: 180, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{ transformPerspective: 1200 }}
    >
      {/* Top gradient bar */}
      <div className={`h-2 bg-gradient-to-r ${statusColors[token.status]}`} />

      <div className="p-6 md:p-8">
        {/* Token Number */}
        <div className="text-center mb-6">
          <p className="text-sm text-white/40 font-medium mb-2">YOUR TOKEN</p>
          <motion.div
            className="font-display font-black text-6xl md:text-7xl gradient-text glow-text"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
          >
            #{token.tokenCode}
          </motion.div>
          <p className="mt-2 font-mono text-sm text-white/30">{token.tokenNumber}</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white rounded-xl">
            <QRCodeSVG
              value={token.tokenNumber}
              size={120}
              level="M"
              bgColor="#ffffff"
              fgColor="#0f172a"
            />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          {[
            { icon: User, label: 'Patient', value: patient.fullName },
            { icon: Stethoscope, label: 'Department', value: dept.name },
            { icon: Hash, label: 'Counter', value: `Counter ${token.counterNumber}` },
            { icon: MapPin, label: 'Doctor', value: token.doctorName },
            { icon: Clock, label: 'Est. Wait', value: `${token.estimatedWaitTime} min` },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <item.icon className="w-4 h-4 text-primary-400 shrink-0" />
              <span className="text-white/40 text-sm w-24">{item.label}</span>
              <span className="text-white font-medium text-sm">{item.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Status badge */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full
                         bg-gradient-to-r ${statusColors[token.status]} text-white font-semibold text-sm`}>
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            {token.status.charAt(0).toUpperCase() + token.status.slice(1)}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
