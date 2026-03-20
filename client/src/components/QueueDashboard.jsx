import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock, MonitorPlay, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { useTokenContext } from '../context/TokenContext';
import TokenCard from './TokenCard';
import { staggerContainer, fadeUp } from '../animations/variants';

export default function QueueDashboard({ departmentId }) {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState(null);
  const { socket, queueUpdates } = useTokenContext();

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const [queueRes, deptRes] = await Promise.all([
        api.get(`/tokens/queue/${departmentId}`),
        api.get(`/departments/${departmentId}`),
      ]);
      setTokens(queueRes.data);
      setDepartment(deptRes.data);
    } catch (err) {
      console.error('Failed to fetch queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (departmentId) fetchQueue();
  }, [departmentId]);

  useEffect(() => {
    if (socket) {
      socket.on('token:called', () => fetchQueue());
      socket.on('queue:updated', (data) => {
        if (data.departmentId === departmentId) fetchQueue();
      });
    }
  }, [socket, departmentId]);

  const currentToken = tokens.find(t => t.status === 'in-progress');
  const waitingTokens = tokens.filter(t => t.status === 'waiting');

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Department header */}
      {department && (
        <motion.div variants={fadeUp} className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-2xl text-white">
                {department.name}
              </h2>
              <p className="text-white/40 text-sm mt-1">
                Counter {department.counterNumber} • Avg {department.avgTimePerPatient} min/patient
              </p>
            </div>
            <motion.button
              onClick={fetchQueue}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60
                       hover:bg-white/10 hover:text-white transition-colors"
              whileHover={{ rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <RefreshCw className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[
              { icon: Users, label: 'In Queue', value: waitingTokens.length, color: 'text-amber-400' },
              { icon: MonitorPlay, label: 'Now Serving', value: currentToken ? `#${currentToken.tokenCode}` : '—', color: 'text-emerald-400' },
              { icon: Clock, label: 'Est. Wait', value: `${waitingTokens.length * (department.avgTimePerPatient || 10)} min`, color: 'text-primary-400' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center p-3 rounded-xl bg-white/5"
                variants={fadeUp}
              >
                <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/40">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Current token */}
      {currentToken && (
        <motion.div variants={fadeUp}>
          <p className="text-sm text-white/40 mb-3 font-medium">NOW SERVING</p>
          <motion.div
            className="glass-strong p-6 rounded-2xl border-2 border-emerald-500/30"
            animate={{ boxShadow: ['0 0 20px rgba(16,185,129,0.1)', '0 0 40px rgba(16,185,129,0.2)', '0 0 20px rgba(16,185,129,0.1)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <TokenCard token={currentToken} compact />
          </motion.div>
        </motion.div>
      )}

      {/* Waiting tokens */}
      <motion.div variants={fadeUp}>
        <p className="text-sm text-white/40 mb-3 font-medium">
          WAITING ({waitingTokens.length})
        </p>
        <div className="space-y-2">
          <AnimatePresence>
            {waitingTokens.map((token, i) => (
              <motion.div
                key={token._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: i * 0.05 }}
              >
                <TokenCard token={token} compact />
              </motion.div>
            ))}
          </AnimatePresence>

          {waitingTokens.length === 0 && !loading && (
            <motion.p
              className="text-center py-8 text-white/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No patients waiting in queue
            </motion.p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
