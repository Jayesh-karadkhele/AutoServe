import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  Upload,
  Play,
  CheckSquare,
  PackageCheck,
  FileImage,
} from 'lucide-react';

export const MechanicWorkspacePreview: React.FC = () => {
  const [jobStatus, setJobStatus] = useState<'pending' | 'in_progress' | 'completed'>('in_progress');
  const [checklist, setChecklist] = useState([
    { id: 'c1', task: 'Obd-II diagnostic scan', done: true },
    { id: 'c2', task: 'Inspect front brake rotor thickness (min 24mm)', done: true },
    { id: 'c3', task: 'Replace ceramic brake pads (OEM Part #BP-8842)', done: false },
    { id: 'c4', task: 'Brake fluid flush & pressure bleeding', done: false },
    { id: 'c5', task: 'Road test torque & pedal feedback test', done: false },
  ]);

  const toggleCheck = (id: string) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const completedCount = checklist.filter(c => c.done).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
              JOB-2024-884
            </span>
            <span className="text-xs text-slate-300">Assigned to Marcus Vance (Tech #3)</span>
          </div>
          <h4 className="text-base font-semibold text-white">2022 Porsche Taycan 4S — Brake System Service</h4>
          <p className="text-xs text-slate-300">Customer concern: High-speed vibration & squeal during braking</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {jobStatus === 'in_progress' && (
            <button
              onClick={() => setJobStatus('completed')}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-white font-medium text-xs hover:bg-emerald-600 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Complete Job Card
            </button>
          )}
          {jobStatus === 'pending' && (
            <button
              onClick={() => setJobStatus('in_progress')}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-white font-medium text-xs hover:bg-amber-600 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Play className="w-3.5 h-3.5" />
              Start Work
            </button>
          )}
          {jobStatus === 'completed' && (
            <span className="px-3 py-1.5 rounded-lg bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Job Completed & Sent to Review
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Diagnostic Checklist & Required Parts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Checklist */}
          <div className="p-5 rounded-xl border border-slate-200/80 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-cyan-600" />
                <h5 className="font-semibold text-slate-900 text-sm">Diagnostic & Service Checklist</h5>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {completedCount} of {checklist.length} tasks verified
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-600 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / checklist.length) * 100}%` }}
              />
            </div>

            <div className="space-y-2 pt-1">
              {checklist.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 ${
                    item.done
                      ? 'bg-slate-50/80 border-slate-200 text-slate-600'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-xs'
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    item.done ? 'bg-cyan-600 border-cyan-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {item.done && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className={`text-xs font-medium ${item.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {item.task}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Required Parts */}
          <div className="p-5 rounded-xl border border-slate-200/80 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-amber-600" />
                <h5 className="font-semibold text-slate-900 text-sm">Requisitioned Parts</h5>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                All Reserved at Bay 3
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-800">Front Ceramic Brake Pads (Set)</span>
                  <p className="text-[11px] text-slate-400">Part #BP-8842 • Taycan Spec</p>
                </div>
                <div className="text-right font-mono text-slate-600">
                  <span>Qty: 1</span>
                  <span className="ml-2 text-emerald-600 font-medium">Ready</span>
                </div>
              </div>
              <div className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-800">DOT 4 High-Temp Brake Fluid (1L)</span>
                  <p className="text-[11px] text-slate-400">Part #FL-9021 • Porsche Approved</p>
                </div>
                <div className="text-right font-mono text-slate-600">
                  <span>Qty: 2</span>
                  <span className="ml-2 text-emerald-600 font-medium">Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Evidence Upload & Assigned Queue */}
        <div className="space-y-6">
          {/* Photo & Video Evidence Upload Area */}
          <div className="p-5 rounded-xl border border-slate-200/80 bg-white shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-600" />
              <h5 className="font-semibold text-slate-900 text-sm">Attach Repair Evidence</h5>
            </div>

            <div className="p-4 rounded-lg border-2 border-dashed border-cyan-200 bg-cyan-50/30 text-center space-y-2 cursor-pointer hover:bg-cyan-50/60 transition-colors">
              <FileImage className="w-6 h-6 text-cyan-600 mx-auto" />
              <div>
                <p className="text-xs font-semibold text-cyan-900">Upload Photo or Video</p>
                <p className="text-[11px] text-slate-500">Drag files here or tap to select from tablet camera</p>
              </div>
            </div>

            {/* Existing uploaded evidence */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">Attached (2)</span>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center text-slate-600 font-mono text-[10px]">
                    IMG1
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 text-[11px]">front_rotor_wear.jpg</p>
                    <p className="text-[10px] text-slate-400">2.4 MB • High Res</p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">Uploaded</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center text-slate-600 font-mono text-[10px]">
                    IMG2
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 text-[11px]">pad_measurement_micrometer.jpg</p>
                    <p className="text-[10px] text-slate-400">1.8 MB • High Res</p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">Uploaded</span>
              </div>
            </div>
          </div>

          {/* Assigned Jobs Queue (Only assigned to this tech) */}
          <div className="p-5 rounded-xl border border-slate-200/80 bg-white shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-slate-700" />
                <h5 className="font-semibold text-slate-900 text-sm">My Next Assigned Jobs</h5>
              </div>
              <span className="text-xs text-slate-400">2 queued</span>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>2021 BMW M4</span>
                  <span className="text-[10px] font-mono text-slate-500">14:00 Today</span>
                </div>
                <p className="text-[11px] text-slate-500">Scheduled: Synthetic Oil Service & Inspection</p>
              </div>

              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>2023 Audi RS6</span>
                  <span className="text-[10px] font-mono text-slate-500">Tomorrow 09:00</span>
                </div>
                <p className="text-[11px] text-slate-500">Scheduled: Suspension Alignment & Calibration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
