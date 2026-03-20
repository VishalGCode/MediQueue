import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FileText, Building2, Ticket } from 'lucide-react';
import { scalePop, fadeUp, staggerContainer } from '../animations/variants';

const steps = [
  {
    number: '01',
    title: 'Fill Your Details',
    description: 'Enter your name, age, gender, and medical complaint. Quick and easy — takes less than a minute.',
    icon: FileText,
    color: 'from-blue-500 to-cyan-400',
  },
  {
    number: '02',
    title: 'Choose Department',
    description: 'Select your OPD department. See live queue count and estimated wait times before choosing.',
    icon: Building2,
    color: 'from-primary-500 to-teal-400',
  },
  {
    number: '03',
    title: 'Get Your Token',
    description: 'Receive your digital token instantly with QR code. Track your position in real-time.',
    icon: Ticket,
    color: 'from-cyan-400 to-emerald-400',
  },
];

export default function StickyScroll() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section ref={containerRef} className="relative py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.span
            className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary-300
                     bg-primary-500/10 border border-primary-500/20 rounded-full"
          >
            How It Works
          </motion.span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            Three Simple <span className="gradient-text">Steps</span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Book your hospital token in under 60 seconds
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          {/* Left: Sticky illustration panel */}
          <div className="hidden md:block">
            <div className="sticky top-32">
              <motion.div
                className="relative glass p-8 rounded-3xl overflow-hidden"
                whileInView={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                viewport={{ once: true }}
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-cyan-500/10" />

                {/* Progress line */}
                <div className="absolute left-12 top-8 bottom-8 w-0.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="w-full bg-gradient-to-b from-primary-400 to-cyan-400 rounded-full"
                    style={{ height: progressHeight }}
                  />
                </div>

                {/* Step indicators */}
                <div className="relative space-y-16 pl-16">
                  {steps.map((step, i) => (
                    <motion.div
                      key={i}
                      className="relative"
                      initial={{ opacity: 0.3 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{ delay: i * 0.2 }}
                    >
                      <div className={`absolute -left-[3.25rem] w-10 h-10 rounded-full
                                    bg-gradient-to-r ${step.color} flex items-center justify-center
                                    shadow-lg`}>
                        <step.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-6xl font-display font-black text-white/5">
                        {step.number}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Decorative orbs */}
                <motion.div
                  className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </div>

          {/* Right: Scrolling steps */}
          <motion.div
            className="space-y-12 md:space-y-24"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="group"
                variants={fadeUp}
              >
                <div className="glass p-8 rounded-2xl hover:bg-white/10 transition-colors duration-300">
                  {/* Mobile step number */}
                  <motion.div
                    className="md:hidden mb-4"
                    variants={scalePop}
                  >
                    <div className={`inline-flex w-12 h-12 rounded-xl
                                  bg-gradient-to-r ${step.color} items-center justify-center
                                  shadow-lg`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>

                  <span className={`inline-block text-sm font-bold tracking-widest
                                bg-gradient-to-r ${step.color} bg-clip-text text-transparent mb-3`}>
                    STEP {step.number}
                  </span>

                  <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-3
                             group-hover:text-primary-300 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-white/50 leading-relaxed text-lg">
                    {step.description}
                  </p>

                  {/* Hover line */}
                  <motion.div
                    className={`h-0.5 mt-6 rounded-full bg-gradient-to-r ${step.color}`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.2, duration: 0.8 }}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
