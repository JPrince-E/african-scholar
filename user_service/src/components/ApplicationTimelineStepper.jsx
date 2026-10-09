import React from 'react';
import { FileText, Search, Users, Scale, Award, Check } from 'lucide-react';

const ApplicationTimelineStepper = ({ status = 'SUBMITTED', refereeCount = 0 }) => {
  // Determine current active step index (0 to 4)
  let currentStep = 0;
  if (status === 'SUBMITTED') {
    currentStep = refereeCount > 0 ? 2 : 1; // Preliminary Screening / Referee
  } else if (status === 'UNDER_REVIEW') {
    currentStep = 3; // Jury Rubric Review
  } else if (status === 'APPROVED' || status === 'AWARDED') {
    currentStep = 4; // Official Verdict
  } else if (status === 'REJECTED') {
    currentStep = 4;
  }

  const steps = [
    {
      id: 0,
      title: 'Dossier Submitted',
      description: 'Publications, citations & proofs logged',
      icon: <FileText className="w-5 h-5 text-blue-400" />
    },
    {
      id: 1,
      title: 'Preliminary Screening',
      description: 'Compliance & benchmark indexing verified',
      icon: <Search className="w-5 h-5 text-purple-400" />
    },
    {
      id: 2,
      title: 'Referee Endorsements',
      description: 'Confidential letters received',
      icon: <Users className="w-5 h-5 text-emerald-400" />
    },
    {
      id: 3,
      title: 'Jury Rubric Review',
      description: 'Multi-juror 100-pt consensus scoring',
      icon: <Scale className="w-5 h-5 text-amber-400" />
    },
    {
      id: 4,
      title: 'Official Verdict',
      description: status === 'APPROVED' || status === 'AWARDED' ? 'Laureate Conferred' : (status === 'REJECTED' ? 'Cycle Concluded' : 'Council Decision'),
      icon: <Award className="w-5 h-5 text-amber-400" />
    }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Nomination Lifecycle Progress</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
              Stage {Math.min(currentStep + 1, 5)} of 5
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time tracking of candidate dossier through the Continental Academic Jury evaluation process.
          </p>
        </div>

        <div className="text-right">
          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
            status === 'APPROVED' || status === 'AWARDED' 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : status === 'UNDER_REVIEW'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
          }`}>
            {status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
        {steps.map((step) => {
          const isDone = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isPending = step.id > currentStep;

          return (
            <div
              key={step.id}
              className={`relative rounded-xl p-3.5 border transition ${
                isCurrent
                  ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30'
                  : isDone
                  ? 'bg-slate-800/60 border-emerald-500/30'
                  : 'bg-slate-900/40 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{step.icon}</span>
                {isDone ? (
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                ) : isCurrent ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                ) : (
                  <span className="text-[10px] text-slate-600 font-mono">0{step.id + 1}</span>
                )}
              </div>

              <div className={`text-xs font-bold ${
                isCurrent ? 'text-amber-300' : isDone ? 'text-white' : 'text-slate-400'
              }`}>
                {step.title}
              </div>

              <div className="text-[10px] text-slate-500 mt-1 leading-snug">
                {step.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationTimelineStepper;
