import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CalendarCheck, ShieldCheck, Wrench, FileCheck, CheckCircle2 } from 'lucide-react';
import { FloatingStatusCard } from './FloatingStatusCard';
import type { StatusCardItem } from './FloatingStatusCard';
import { useReducedMotionContext } from '@/motion/ReducedMotionContext';

export const ServicePulseVisual: React.FC = () => {
  const isReducedMotion = useReducedMotionContext();
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x: x * 15, y: y * 15 });
  };

  const statusCards: { item: StatusCardItem; position: string; delay: number }[] = [
    {
      item: {
        id: '1',
        title: 'Appointment Confirmed',
        subtitle: 'Toyota Camry • Slot #AS-942',
        time: '10:00 AM',
        icon: <CalendarCheck className="w-4 h-4 text-[#00A7B5]" />,
        badgeText: 'CONFIRMED',
        badgeVariant: 'cyan',
      },
      position: 'top-2 -left-4 sm:-left-8 z-20 w-56 sm:w-64',
      delay: 0.4,
    },
    {
      item: {
        id: '2',
        title: 'Manager Assigned',
        subtitle: 'David M. • Workshop Bay 3',
        time: '10:15 AM',
        icon: <ShieldCheck className="w-4 h-4 text-[#178A68]" />,
        badgeText: 'ASSIGNED',
        badgeVariant: 'success',
      },
      position: 'top-24 -right-2 sm:-right-6 z-20 w-56 sm:w-64',
      delay: 0.6,
    },
    {
      item: {
        id: '3',
        title: 'Service In Progress',
        subtitle: 'Full 30k Inspection & Oil Change',
        time: 'LIVE',
        icon: <Wrench className="w-4 h-4 text-[#F4512C]" />,
        badgeText: 'ACTIVE',
        badgeVariant: 'orange',
      },
      position: 'bottom-28 -left-4 sm:-left-6 z-20 w-56 sm:w-64',
      delay: 0.8,
    },
    {
      item: {
        id: '4',
        title: 'Repair Evidence Added',
        subtitle: '3 Photos & 1 Video Uploaded',
        time: '11:45 AM',
        icon: <FileCheck className="w-4 h-4 text-[#00A7B5]" />,
        badgeText: 'VERIFIED',
        badgeVariant: 'cyan',
      },
      position: 'bottom-6 -right-2 sm:-right-4 z-20 w-56 sm:w-64',
      delay: 1.0,
    },
  ];

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMouseOffset({ x: 0, y: 0 })}
      className="relative w-full aspect-4/3 max-w-xl mx-auto flex items-center justify-center p-4 select-none"
    >
      {/* Background Radial Illumination & Tech Ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-radial from-[#EAF7FA]/80 via-[#F2F7F8]/40 to-transparent blur-2xl" />
        <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-[#00A7B5]/15 animate-spin-slow opacity-60" style={{ animationDuration: '60s' }} />
        <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-dashed border-[#17212B]/10" />
      </div>

      {/* Main Vehicle Graphic Container with Mouse Parallax */}
      <motion.div
        animate={
          isReducedMotion
            ? {}
            : {
                x: mouseOffset.x,
                y: mouseOffset.y,
              }
        }
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        {/* Generic Modern Automotive Side Profile Silhouette SVG */}
        <svg
          viewBox="0 0 500 240"
          className="w-full h-auto drop-shadow-md text-[#17212B]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Grid Guidelines */}
          <line x1="40" y1="180" x2="460" y2="180" stroke="#17212B" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="250" y1="30" x2="250" y2="200" stroke="#00A7B5" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="2 2" />

          {/* Vehicle Body Contour */}
          <path
            d="M 50 165 C 50 165 70 162 100 162 C 120 162 135 130 165 110 C 195 90 270 85 330 90 C 370 95 410 120 435 145 C 455 160 460 165 460 165 L 440 170 C 440 170 425 155 400 155 C 375 155 360 170 360 170 L 190 170 C 190 170 175 155 150 155 C 125 155 110 170 110 170 Z"
            fill="#FFFFFF"
            stroke="#17212B"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Glass Roof Line */}
          <path
            d="M 175 108 C 205 92 265 88 320 93 C 355 98 385 118 405 138 L 335 138 C 335 138 275 105 205 105 Z"
            fill="#EAF7FA"
            stroke="#00A7B5"
            strokeWidth="1.5"
          />

          {/* Wheel Arch Details */}
          <circle cx="130" cy="165" r="28" fill="#F7F5EF" stroke="#17212B" strokeWidth="3" />
          <circle cx="130" cy="165" r="18" fill="#FFFFFF" stroke="#00A7B5" strokeWidth="2" />
          <circle cx="130" cy="165" r="6" fill="#17212B" />

          <circle cx="380" cy="165" r="28" fill="#F7F5EF" stroke="#17212B" strokeWidth="3" />
          <circle cx="380" cy="165" r="18" fill="#FFFFFF" stroke="#00A7B5" strokeWidth="2" />
          <circle cx="380" cy="165" r="6" fill="#17212B" />

          {/* Precision Sensor & Telemetry Nodes */}
          <circle cx="250" cy="88" r="4" fill="#F4512C" />
          <circle cx="250" cy="88" r="8" stroke="#F4512C" strokeWidth="1" strokeDasharray="2 2" />

          <circle cx="435" cy="148" r="3.5" fill="#00A7B5" />
          <line x1="435" y1="148" x2="470" y2="120" stroke="#00A7B5" strokeWidth="1" strokeDasharray="2 2" />

          {/* Status Indicator Signal Arc */}
          <path
            d="M 120 70 A 140 140 0 0 1 380 70"
            fill="none"
            stroke="#F4512C"
            strokeWidth="2"
            strokeDasharray="6 6"
            opacity="0.8"
          />
        </svg>

        {/* Center Live Diagnostic Telemetry Pill */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-[#17212B]/10 rounded-full px-4 py-1.5 shadow-xs flex items-center gap-2 z-20">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#178A68]" />
          <span className="text-[11px] font-mono-tech text-[#17212B] font-medium uppercase tracking-wider">
            HEALTH STATUS: 99.4% • ALL SYSTEMS SYNCED
          </span>
        </div>
      </motion.div>

      {/* Floating Status Cards Layer */}
      {statusCards.map(({ item, position, delay }) => (
        <div key={item.id} className={`absolute ${position}`}>
          <FloatingStatusCard item={item} delay={delay} isReducedMotion={isReducedMotion} />
        </div>
      ))}
    </div>
  );
};
