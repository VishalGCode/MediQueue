import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, fadeUp, staggerContainer } from '../animations/variants';
import QueueDashboard from '../components/QueueDashboard';
import DepartmentCard from '../components/DepartmentCard';
import api from '../services/api';

export default function Queue() {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await api.get('/departments');
        setDepartments(res.data);
      } catch {
        const fallback = [
          { _id: '1', name: 'General Medicine', code: 'GEN', icon: 'Stethoscope', currentQueue: 12, avgTimePerPatient: 8, doctors: [{ name: 'Dr. Rajesh Kumar', available: true }] },
          { _id: '2', name: 'Cardiology', code: 'CARD', icon: 'Heart', currentQueue: 5, avgTimePerPatient: 15, doctors: [{ name: 'Dr. Amit Verma', available: true }] },
          { _id: '3', name: 'Orthopedics', code: 'ORTHO', icon: 'Bone', currentQueue: 8, avgTimePerPatient: 12, doctors: [{ name: 'Dr. Vikram Singh', available: true }] },
          { _id: '4', name: 'Pediatrics', code: 'PED', icon: 'Baby', currentQueue: 15, avgTimePerPatient: 10, doctors: [{ name: 'Dr. Meena Gupta', available: true }] },
        ];
        setDepartments(fallback);
      }
    };
    fetchDepts();
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-24 pb-16 px-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-10" {...fadeUp}>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-3">
            Live <span className="gradient-text">Queue</span>
          </h1>
          <p className="text-white/40 text-lg">
            {selectedDept ? `Viewing queue for ${selectedDept.name}` : 'Select a department to view queue'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Department list */}
          <motion.div
            className="lg:col-span-1 space-y-3"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <p className="text-sm text-white/40 font-medium mb-3">DEPARTMENTS</p>
            {departments.map((dept) => (
              <motion.div
                key={dept._id}
                variants={fadeUp}
                onClick={() => setSelectedDept(dept)}
                className={`cursor-pointer transition-all ${
                  selectedDept?._id === dept._id ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-dark-950 rounded-2xl' : ''
                }`}
              >
                <DepartmentCard department={dept} />
              </motion.div>
            ))}
          </motion.div>

          {/* Queue dashboard */}
          <div className="lg:col-span-2">
            {selectedDept ? (
              <QueueDashboard departmentId={selectedDept._id} />
            ) : (
              <motion.div
                className="glass p-16 rounded-3xl text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <span className="text-4xl">👈</span>
                </motion.div>
                <h3 className="font-display font-semibold text-xl text-white mb-2">
                  Select a Department
                </h3>
                <p className="text-white/40">
                  Choose a department from the left panel to view the live queue status
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
