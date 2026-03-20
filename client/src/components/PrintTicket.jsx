import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Printer } from 'lucide-react';

export default function PrintTicket({ token }) {
  const printRef = useRef(null);

  if (!token) return null;

  const patient = token.patientId || {};
  const dept = token.departmentId || {};
  const date = new Date(token.createdAt);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Print button */}
      <motion.button
        onClick={handlePrint}
        className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20
                 rounded-xl text-white font-medium hover:bg-white/20 transition-colors mb-6 mx-auto"
        whileHover={{ scale: 1.05, y: -2, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
        whileTap={{ scale: 0.95 }}
      >
        <Printer className="w-5 h-5" />
        Print Ticket
      </motion.button>

      {/* Printable ticket */}
      <div ref={printRef} className="print-ticket bg-white text-black max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6">
          {/* Hospital header */}
          <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
            <h1 className="text-xl font-bold text-gray-900">🏥 MediQueue Hospital</h1>
            <p className="text-xs text-gray-500 mt-1">Smart OPD Token System</p>
          </div>

          {/* Token number - large */}
          <div className="text-center my-6">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Token Number</p>
            <p className="text-7xl font-black text-gray-900 my-2">
              {String(token.tokenCode).padStart(3, '0')}
            </p>
            <p className="text-sm font-mono text-gray-400">{token.tokenNumber}</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center my-4">
            <QRCodeSVG
              value={token.tokenNumber}
              size={100}
              level="M"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>

          {/* Patient details */}
          <div className="border-t-2 border-dashed border-gray-300 pt-4 mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Patient:</span>
              <span className="font-semibold">{patient.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Age/Gender:</span>
              <span>{patient.age} / {patient.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Department:</span>
              <span className="font-semibold">{dept.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Doctor:</span>
              <span>{token.doctorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Counter:</span>
              <span>Counter {token.counterNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Priority:</span>
              <span className={token.priority === 'emergency' ? 'text-red-600 font-bold' : ''}>
                {token.priority.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Est. Wait:</span>
              <span>{token.estimatedWaitTime} minutes</span>
            </div>
          </div>

          {/* Date/Time */}
          <div className="border-t-2 border-dashed border-gray-300 pt-4 mt-4 text-center">
            <p className="text-xs text-gray-400">
              {date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              {' • '}
              {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Please wait for your token to be called.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
