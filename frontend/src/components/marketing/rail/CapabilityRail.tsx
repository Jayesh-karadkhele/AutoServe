import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, FileText, Activity, Camera, Package, Receipt, CreditCard, Navigation } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Surface } from '@/components/ui/Surface';
import { IconButton } from '@/components/ui/IconButton';

export const CapabilityRail: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);

  const capabilities = [
    {
      num: '01',
      title: 'Appointments',
      tag: 'BOOKING & RSA',
      desc: 'Guided customer booking flow with date, time, vehicle selection, and emergency RSA dispatch.',
      icon: <Calendar className="w-5 h-5 text-[#00A7B5]" />,
    },
    {
      num: '02',
      title: 'Job Cards',
      tag: 'WORKFLOW ENGINE',
      desc: 'Structured service execution tracking linking mechanics, manager approvals, and parts used.',
      icon: <FileText className="w-5 h-5 text-[#F4512C]" />,
    },
    {
      num: '03',
      title: 'Service Tracking',
      tag: 'LIVE TELEMETRY',
      desc: 'Real-time service progress updates from approval and diagnostic through inspection and handover.',
      icon: <Activity className="w-5 h-5 text-[#178A68]" />,
    },
    {
      num: '04',
      title: 'Repair Evidence',
      tag: 'CLOUDINARY VAULT',
      desc: 'Before and after photographic evidence uploads with timestamps and manager verification.',
      icon: <Camera className="w-5 h-5 text-[#00A7B5]" />,
    },
    {
      num: '05',
      title: 'Inventory Control',
      tag: 'PARTS & STOCK',
      desc: 'Real-time OEM spare parts inventory tracking with SKU codes, unit costs, and stock alerts.',
      icon: <Package className="w-5 h-5 text-[#E89B24]" />,
    },
    {
      num: '06',
      title: 'Digital Invoices',
      tag: 'SNAPSHOT PRICING',
      desc: 'Itemized OpenPDF digital invoices with snapshot price locking preserving billed line items.',
      icon: <Receipt className="w-5 h-5 text-[#178A68]" />,
    },
    {
      num: '07',
      title: 'Razorpay Payments',
      tag: 'HMAC SHA256',
      desc: 'Secure digital payment order creation and signature verification for online bill settlement.',
      icon: <CreditCard className="w-5 h-5 text-[#00A7B5]" />,
    },
    {
      num: '08',
      title: 'Roadside Assistance',
      tag: 'LOCATION DISPATCH',
      desc: 'GPS-aware emergency assistance dispatch connecting stranded drivers with nearby service bays.',
      icon: <Navigation className="w-5 h-5 text-[#F4512C]" />,
    },
  ];

  const handlePrev = () => {
    setCurrentIdx((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIdx((prev) => Math.min(capabilities.length - 1, prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  };

  return (
    <Section className="bg-[#F2F7F8]/60 border-t border-[#17212B]/08 py-16 lg:py-24">
      <Container size="xl">
        {/* Rail Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <Badge variant="orange" className="mb-3">
              PLATFORM CAPABILITIES
            </Badge>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#17212B] tracking-tight">
              Integrated vehicle care modules.
            </h3>
          </div>

          {/* Controls & Counter */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono-tech text-[#66737E]">
              0{currentIdx + 1} / 0{capabilities.length}
            </span>
            <div className="flex items-center gap-2" tabIndex={0} onKeyDown={handleKeyDown} aria-label="Capability Rail Navigation">
              <IconButton
                ariaLabel="Previous capability"
                onClick={handlePrev}
                disabled={currentIdx === 0}
                variant="secondary"
              >
                <ChevronLeft className="w-5 h-5" />
              </IconButton>
              <IconButton
                ariaLabel="Next capability"
                onClick={handleNext}
                disabled={currentIdx === capabilities.length - 1}
                variant="secondary"
              >
                <ChevronRight className="w-5 h-5" />
              </IconButton>
            </div>
          </div>
        </div>

        {/* Capability Cards Rail Grid */}
        <div ref={railRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
          {capabilities.slice(currentIdx, currentIdx + 4).map((cap) => (
            <Surface
              key={cap.num}
              variant="surface"
              elevation="xs"
              className="p-6 flex flex-col justify-between hover:border-[#17212B]/25 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F7F5EF] border border-[#17212B]/08 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {cap.icon}
                  </div>
                  <span className="text-[10px] font-mono-tech text-[#66737E] bg-[#F2F7F8] px-2 py-0.5 rounded border border-[#17212B]/06">
                    {cap.tag}
                  </span>
                </div>

                <div className="text-xs font-mono-tech text-[#F4512C] font-semibold mb-1">{cap.num}</div>
                <h4 className="text-lg font-display font-semibold text-[#17212B] mb-2">{cap.title}</h4>
                <p className="text-xs text-[#66737E] leading-relaxed">{cap.desc}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#17212B]/06 text-[10px] font-mono-tech text-[#00A7B5] font-semibold uppercase tracking-wider">
                READINESS: BUILT & VERIFIED
              </div>
            </Surface>
          ))}
        </div>
      </Container>
    </Section>
  );
};
