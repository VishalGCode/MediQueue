import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User, Phone, Calendar, MapPin, FileText, Building2,
  ChevronRight, ChevronLeft, AlertCircle, Loader2, Heart,
} from 'lucide-react';
import { pageVariants, slideRight, shakeX, staggerContainer, fadeUp } from '../animations/variants';
import DepartmentCard from '../components/DepartmentCard';
import api from '../services/api';
import { useToken } from '../hooks/useToken';
import { useTokenContext } from '../context/TokenContext';

const patientSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.coerce.number().min(0, 'Invalid age').max(150, 'Invalid age'),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Select gender' }),
  mobile: z.string().min(10, 'Enter valid mobile number'),
  complaint: z.string().min(3, 'Describe your complaint'),
  address: z.string().optional(),
});

const stepVariants = {
  enter: { x: 300, opacity: 0, filter: 'blur(4px)' },
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    x: -300,
    opacity: 0,
    filter: 'blur(4px)',
    transition: { duration: 0.3 },
  },
};

function FormField({ label, icon: Icon, error, children }) {
  return (
    <motion.div
      variants={fadeUp}
      className="space-y-2"
    >
      <label className="flex items-center gap-2 text-sm font-medium text-white/60">
        <Icon className="w-4 h-4" />
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto', x: [0, -10, 10, -10, 0] }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="text-red-400 text-xs flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function BookToken() {
  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [priority, setPriority] = useState('normal');
  const { generateToken, loading } = useToken();
  const { setCurrentToken } = useTokenContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm({
    resolver: zodResolver(patientSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await api.get('/departments');
        setDepartments(res.data);
        const preselect = searchParams.get('dept');
        if (preselect) {
          const found = res.data.find(d => d._id === preselect);
          if (found) setSelectedDept(found);
        }
      } catch {
        // Fallback
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
      }
    };
    fetchDepts();
  }, []);

  const nextStep = async () => {
    if (step === 1) {
      const valid = await trigger(['fullName', 'age', 'gender', 'mobile', 'complaint']);
      if (valid) setStep(2);
    } else if (step === 2) {
      if (selectedDept) setStep(3);
    }
  };

  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const onSubmit = async (data) => {
    if (!selectedDept) return;
    try {
      const token = await generateToken(data, selectedDept._id, priority);
      setCurrentToken(token);
      navigate(`/token/${token.tokenNumber}`);
    } catch (err) {
      // Error handled in hook
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-24 pb-16 px-4"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-10" {...fadeUp}>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-3">
            Book Your <span className="gradient-text">Token</span>
          </h1>
          <p className="text-white/40 text-lg">
            Fill the form below to get your OPD token
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            {['Patient Details', 'Department', 'Confirm'].map((label, i) => (
              <motion.div
                key={i}
                className={`flex items-center gap-2 text-sm font-medium
                  ${step > i + 1 ? 'text-primary-400' :
                    step === i + 1 ? 'text-white' : 'text-white/30'}`}
                animate={{ scale: step === i + 1 ? 1.05 : 1 }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  ${step > i + 1 ? 'bg-primary-500 text-dark-950' :
                    step === i + 1 ? 'bg-gradient-to-r from-primary-500 to-cyan-400 text-dark-950' :
                    'bg-white/10 text-white/50'}`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className="hidden sm:inline">{label}</span>
              </motion.div>
            ))}
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-cyan-400 rounded-full"
              animate={{ width: `${step * 33.33}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Form steps */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="glass-strong p-6 md:p-8 rounded-3xl"
              >
                <h2 className="font-display font-bold text-xl text-white mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-400" />
                  Patient Information
                </h2>

                <motion.div
                  className="space-y-5"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  <FormField label="Full Name" icon={User} error={errors.fullName?.message}>
                    <input {...register('fullName')} className="input-field" placeholder="Enter patient's full name" />
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Age" icon={Calendar} error={errors.age?.message}>
                      <input type="number" {...register('age')} className="input-field" placeholder="Age" />
                    </FormField>

                    <FormField label="Gender" icon={User} error={errors.gender?.message}>
                      <select {...register('gender')} className="input-field">
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </FormField>
                  </div>

                  <FormField label="Mobile Number" icon={Phone} error={errors.mobile?.message}>
                    <input {...register('mobile')} className="input-field" placeholder="10-digit mobile number" />
                  </FormField>

                  <FormField label="Chief Complaint" icon={FileText} error={errors.complaint?.message}>
                    <textarea {...register('complaint')} className="input-field h-24 resize-none" placeholder="Describe your symptoms or complaint" />
                  </FormField>

                  <FormField label="Address (Optional)" icon={MapPin} error={errors.address?.message}>
                    <input {...register('address')} className="input-field" placeholder="Your address" />
                  </FormField>
                </motion.div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="glass-strong p-6 md:p-8 rounded-3xl mb-6">
                  <h2 className="font-display font-bold text-xl text-white mb-6 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary-400" />
                    Select Department
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {departments.map((dept) => (
                      <motion.div
                        key={dept._id}
                        onClick={() => setSelectedDept(dept)}
                        className={`cursor-pointer rounded-2xl transition-all ${
                          selectedDept?._id === dept._id
                            ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-dark-950'
                            : ''
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        <DepartmentCard department={dept} />
                      </motion.div>
                    ))}
                  </div>

                  {!selectedDept && (
                    <p className="text-center text-white/30 mt-4 text-sm">
                      Please select a department to continue
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="glass-strong p-6 md:p-8 rounded-3xl"
              >
                <h2 className="font-display font-bold text-xl text-white mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-400" />
                  Confirm Booking
                </h2>

                {/* Summary */}
                <div className="space-y-3 mb-6">
                  {[
                    { label: 'Name', value: getValues('fullName') },
                    { label: 'Age / Gender', value: `${getValues('age')} / ${getValues('gender')}` },
                    { label: 'Mobile', value: getValues('mobile') },
                    { label: 'Complaint', value: getValues('complaint') },
                    { label: 'Department', value: selectedDept?.name },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex justify-between py-2 border-b border-white/5"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <span className="text-white/40 text-sm">{item.label}</span>
                      <span className="text-white font-medium text-sm">{item.value}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Priority */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-white/60 mb-3 block">Priority</label>
                  <div className="flex gap-3">
                    {['normal', 'emergency'].map((p) => (
                      <motion.button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all
                          ${priority === p
                            ? p === 'emergency'
                              ? 'bg-red-500/20 border-red-500/50 text-red-400'
                              : 'bg-primary-500/20 border-primary-500/50 text-primary-400'
                            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {p === 'emergency' && <Heart className="w-4 h-4 inline mr-1" />}
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            <motion.button
              type="button"
              onClick={prevStep}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl
                       bg-white/5 border border-white/10 text-white font-medium
                       hover:bg-white/10 transition-colors
                       ${step === 1 ? 'invisible' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </motion.button>

            {step < 3 ? (
              <motion.button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 rounded-xl
                         bg-gradient-to-r from-primary-500 to-cyan-400
                         text-dark-950 font-bold shadow-lg shadow-primary-500/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={step === 2 && !selectedDept}
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 rounded-xl
                         bg-gradient-to-r from-primary-500 to-cyan-400
                         text-dark-950 font-bold shadow-lg shadow-primary-500/25
                         disabled:opacity-50"
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="submit"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Generate Token
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
}
