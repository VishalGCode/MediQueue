import React, { useEffect, useState, useRef, Suspense } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Users, Building2, Clock, Sparkles,
} from 'lucide-react';
import Hero from '../components/Hero';
import ParallaxText from '../components/ParallaxText';
import ParallaxSection from '../components/ParallaxSection';
import StickyScroll from '../components/StickyScroll';
import DepartmentCard from '../components/DepartmentCard';
import { staggerContainer, fadeUp, numberCount } from '../animations/variants';
import api from '../services/api';
import { useTokenContext } from '../context/TokenContext';

function AnimatedNumber({ target, inView, suffix = '' }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (inView) {
      const controls = animate(0, target, {
        duration: 2,
        ease: 'easeOut',
        onUpdate: (v) => setValue(Math.round(v)),
      });
      return () => controls.stop();
    }
  }, [target, inView]);

  return <>{value}{suffix}</>;
}

function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { label: 'Patients Today', value: 1200, suffix: '+', icon: Users, color: 'from-primary-500 to-cyan-400', glow: true },
    { label: 'Departments', value: 8, suffix: '', icon: Building2, color: 'from-blue-500 to-indigo-400' },
    { label: 'Avg Wait Time', value: 5, suffix: ' min', icon: Clock, color: 'from-emerald-500 to-teal-400' },
    { label: 'Service', value: 100, suffix: '% Free', icon: Sparkles, color: 'from-amber-500 to-orange-400' },
  ];

  return (
    <section ref={ref} className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className={`relative glass p-6 rounded-2xl text-center group hover:bg-white/10 transition-all
                        ${stat.glow ? 'animate-pulse-glow' : ''}`}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${stat.color}
                            flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <motion.p
                variants={numberCount}
                className="text-3xl md:text-4xl font-display font-black text-white"
              >
                <AnimatedNumber target={stat.value} inView={isInView} suffix={stat.suffix} />
              </motion.p>
              <p className="text-white/40 text-sm mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function DepartmentsSection() {
  const [departments, setDepartments] = useState([]);
  const { setDepartments: setCtxDepts } = useTokenContext();

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await api.get('/departments');
        setDepartments(res.data);
        setCtxDepts(res.data);
      } catch (err) {
        // Use fallback data if API is not available
        const fallback = [
          { _id: '1', name: 'General Medicine', code: 'GEN', icon: 'Stethoscope', currentQueue: 12, avgTimePerPatient: 8, doctors: [{ name: 'Dr. Rajesh Kumar', available: true }] },
          { _id: '2', name: 'Cardiology', code: 'CARD', icon: 'Heart', currentQueue: 5, avgTimePerPatient: 15, doctors: [{ name: 'Dr. Amit Verma', available: true }] },
          { _id: '3', name: 'Orthopedics', code: 'ORTHO', icon: 'Bone', currentQueue: 8, avgTimePerPatient: 12, doctors: [{ name: 'Dr. Vikram Singh', available: true }] },
          { _id: '4', name: 'Pediatrics', code: 'PED', icon: 'Baby', currentQueue: 15, avgTimePerPatient: 10, doctors: [{ name: 'Dr. Meena Gupta', available: true }] },
          { _id: '5', name: 'Dermatology', code: 'DERM', icon: 'Shield', currentQueue: 3, avgTimePerPatient: 10, doctors: [{ name: 'Dr. Kavita Reddy', available: true }] },
          { _id: '6', name: 'Ophthalmology', code: 'OPH', icon: 'Eye', currentQueue: 6, avgTimePerPatient: 12, doctors: [{ name: 'Dr. Ravi Nair', available: true }] },
          { _id: '7', name: 'ENT', code: 'ENT', icon: 'Ear', currentQueue: 4, avgTimePerPatient: 10, doctors: [{ name: 'Dr. Sunita Mishra', available: true }] },
          { _id: '8', name: 'Neurology', code: 'NEURO', icon: 'Brain', currentQueue: 2, avgTimePerPatient: 20, doctors: [{ name: 'Dr. Arun Mehta', available: true }] },
        ];
        setDepartments(fallback);
        setCtxDepts(fallback);
      }
    };
    fetchDepts();
  }, []);

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4">
        <ParallaxSection direction="up">
          <div className="text-center mb-16">
            <motion.span
              className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary-300
                       bg-primary-500/10 border border-primary-500/20 rounded-full"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              OPD Departments
            </motion.span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
              Choose Your <span className="gradient-text">Department</span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Select your department to see live queue status and book a token
            </p>
          </div>
        </ParallaxSection>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
        >
          {departments.map((dept) => (
            <motion.div key={dept._id} variants={fadeUp}>
              <Link to={`/book?dept=${dept._id}`}>
                <DepartmentCard department={dept} />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <ParallaxSection direction="up">
          <motion.div
            className="glass-strong p-12 md:p-16 rounded-3xl relative overflow-hidden"
            whileHover={{ scale: 1.01 }}
          >
            <motion.div
              className="absolute -top-20 -right-20 w-60 h-60 bg-primary-500/20 rounded-full blur-3xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-20 -left-20 w-60 h-60 bg-cyan-400/20 rounded-full blur-3xl"
              animate={{ scale: [1.3, 1, 1.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-4 relative">
              Ready to Skip the Line?
            </h2>
            <p className="text-white/50 text-lg mb-8 relative max-w-lg mx-auto">
              Book your OPD token now and save hours of waiting.
              It's free, fast, and hassle-free.
            </p>
            <Link to="/book">
              <motion.button
                className="group inline-flex items-center gap-3 px-10 py-5
                         bg-gradient-to-r from-primary-500 to-cyan-400
                         text-dark-950 font-bold text-lg rounded-2xl
                         shadow-2xl shadow-primary-500/30 relative"
                whileHover={{ scale: 1.05, boxShadow: '0 25px 60px rgba(6,182,212,0.5)' }}
                whileTap={{ scale: 0.95 }}
              >
                Book Your Token Now
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </motion.button>
            </Link>
          </motion.div>
        </ParallaxSection>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Hero />
      <ParallaxText />
      <StatsSection />
      <DepartmentsSection />
      <StickyScroll />
      <CTASection />

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white/30 text-sm">
            © 2026 MediQueue. Built with ❤️ for better healthcare.
          </p>
        </div>
      </footer>
    </motion.div>
  );
}
