import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Users, Clock, CheckCircle, XCircle, AlertTriangle,
  PlayCircle, SkipForward, Download, RotateCcw, LogIn, LogOut,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import api from '../services/api';
import toast from 'react-hot-toast';
import { fadeUp, staggerContainer } from '../animations/variants';

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/login', { username, password });
      localStorage.setItem('adminToken', res.data.token);
      setIsLoggedIn(true);
      toast.success('Logged in successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    toast.success('Logged out');
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      }
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const callNext = async (deptId) => {
    try {
      const res = await api.post(`/admin/next/${deptId}`);
      toast.success(`Called token #${res.data.tokenCode}`);
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'No waiting tokens');
    }
  };

  const resetQueue = async (deptId) => {
    try {
      await api.delete(`/admin/reset/${deptId}`);
      toast.success('Queue reset successfully');
      fetchStats();
    } catch (err) {
      toast.error('Failed to reset queue');
    }
  };

  const exportData = async () => {
    try {
      const res = await api.get('/admin/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'tokens_export.csv';
      link.click();
      toast.success('Export downloaded');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchStats();
  }, [isLoggedIn]);

  // Login form
  if (!isLoggedIn) {
    return (
      <motion.div
        className="max-w-md mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="glass-strong p-8 rounded-3xl">
          <div className="text-center mb-8">
            <motion.div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-400
                       flex items-center justify-center"
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <LogIn className="w-8 h-8 text-dark-950" />
            </motion.div>
            <h2 className="font-display font-bold text-2xl text-white">Admin Login</h2>
            <p className="text-white/40 mt-2">Sign in to manage the queue</p>
          </div>

          <form onSubmit={login} className="space-y-4">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                required
              />
            </motion.div>
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </motion.div>
            <motion.button
              type="submit"
              className="btn-primary w-full text-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Sign In</span>
            </motion.button>
          </form>

          <p className="text-center text-white/30 text-sm mt-4">
            Default: admin / admin123
          </p>
        </div>
      </motion.div>
    );
  }

  if (!stats) return (
    <div className="text-center py-20">
      <motion.div
        className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full mx-auto"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );

  const statCards = [
    { label: 'Total Today', value: stats.totalToday, icon: BarChart3, color: 'from-primary-500 to-cyan-400' },
    { label: 'Waiting', value: stats.waiting, icon: Clock, color: 'from-amber-500 to-orange-400' },
    { label: 'In Progress', value: stats.inProgress, icon: PlayCircle, color: 'from-blue-500 to-indigo-400' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'from-emerald-500 to-green-400' },
    { label: 'Missed', value: stats.missed, icon: XCircle, color: 'from-red-500 to-rose-400' },
  ];

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.h2 variants={fadeUp} className="font-display font-bold text-3xl text-white">
          Admin Dashboard
        </motion.h2>
        <div className="flex gap-3">
          <motion.button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10
                     rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4" /> Export
          </motion.button>
          <motion.button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20
                     rounded-xl text-red-400 hover:bg-red-500/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-4 h-4" /> Logout
          </motion.button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="glass p-4 rounded-2xl text-center group hover:bg-white/10 transition-colors"
            whileHover={{ y: -5 }}
          >
            <div className={`w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-r ${card.color}
                          flex items-center justify-center`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-white/40 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div variants={fadeUp} className="glass p-6 rounded-2xl">
        <h3 className="font-display font-semibold text-lg text-white mb-4">
          Hourly Distribution
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.hourly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" stroke="rgba(255,255,255,0.3)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15,23,42,0.95)',
                  border: '1px solid rgba(6,182,212,0.3)',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {stats.hourly.map((_, i) => (
                  <Cell key={i} fill={`rgba(6, 182, 212, ${0.3 + (i / 24) * 0.7})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Department management */}
      <motion.div variants={fadeUp}>
        <h3 className="font-display font-semibold text-lg text-white mb-4">
          Department Queues
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {stats.departments.map((dept) => (
            <motion.div
              key={dept._id}
              className="glass p-5 rounded-2xl"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-white">{dept.name}</h4>
                  <p className="text-sm text-white/40">{dept.code} • {dept.currentQueue} waiting</p>
                </div>
                <span className={`w-3 h-3 rounded-full ${dept.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
              </div>
              <div className="flex gap-2">
                <motion.button
                  onClick={() => callNext(dept._id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl
                           bg-primary-500/20 text-primary-300 hover:bg-primary-500/30 transition-colors text-sm"
                  whileTap={{ scale: 0.95 }}
                >
                  <SkipForward className="w-4 h-4" /> Call Next
                </motion.button>
                <motion.button
                  onClick={() => resetQueue(dept._id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl
                           bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm"
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
