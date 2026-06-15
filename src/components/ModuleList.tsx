import React, { useState } from "react";
import { FABLE_MODULES } from "../data";
import { FableModule } from "../types";
import { CheckCircle2, ShieldEllipsis, Sparkles, HelpCircle, ArrowRight, UserCheck } from "lucide-react";

export default function ModuleList() {
  const [selectedModule, setSelectedModule] = useState<FableModule>(FABLE_MODULES[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-xl font-sans font-bold text-slate-900 flex items-center gap-2">
            <span className="p-1 px-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-mono rounded-lg">8</span>
            The 8-Module Stack
          </h2>
          <p className="text-sm text-slate-500 font-sans mt-0.5">Explore each behavioral block built from Anthropic's guidelines</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          {FABLE_MODULES.map((mod) => {
            const isActive = selectedModule.id === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setSelectedModule(mod)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                  isActive
                    ? "bg-indigo-50/70 border-indigo-200 text-indigo-900 shadow-sm"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold border transition-colors ${
                    isActive
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-slate-100 border-slate-200 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
                  }`}>
                    {mod.id}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-sans font-semibold leading-tight">{mod.title}</div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5 max-w-[200px] truncate">{mod.tagline}</div>
                  </div>
                </div>
                <ArrowRight className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform ${
                  isActive ? "translate-x-1 text-indigo-500" : ""
                }`} />
              </button>
            );
          })}
        </div>

        {/* Selected Module Detail Panel */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-6 space-y-6">
            {/* Header portion */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                  Behavioral Module #{selectedModule.id}
                </span>
                <h3 className="text-xl font-sans font-bold text-slate-900 mt-2">{selectedModule.title}</h3>
                <p className="text-sm text-slate-500 font-sans mt-0.5 italic">{selectedModule.tagline}</p>
              </div>
            </div>

            {/* Core Explanation */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">The Behavioral Shift</h4>
                <p className="text-sm text-slate-700 font-sans mt-1 leading-relaxed">
                  {selectedModule.explanation}
                </p>
              </div>

              {/* Distilled Guideline */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative overflow-hidden">
                <div className="absolute right-3 top-3 opacity-10">
                  <UserCheck className="w-16 h-16 text-slate-400" />
                </div>
                <h5 className="text-xs font-mono font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Grounded Guideline
                </h5>
                <p className="text-sm text-slate-600 font-sans mt-1 max-w-[90%] leading-relaxed">
                  {selectedModule.fableGuideline}
                </p>
              </div>

              {/* Side by side visual code/results comparison */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Before & After Behavioral Comparison</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before card */}
                  <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl">
                    <span className="text-[10px] font-mono uppercase font-bold text-red-700 bg-red-100/60 px-2 py-0.5 rounded">
                      Standard AI behavior
                    </span>
                    <pre className="text-xs text-red-800 font-mono mt-3 leading-relaxed whitespace-pre-wrap overflow-auto max-h-[140px]">
                      {selectedModule.beforePrompt}
                    </pre>
                  </div>

                  {/* After card */}
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                    <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                      Fable Brain behavior
                    </span>
                    <pre className="text-xs text-emerald-800 font-mono mt-3 leading-relaxed whitespace-pre-wrap overflow-auto max-h-[140px]">
                      {selectedModule.afterPrompt}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Meta portion detailing research Sourcing */}
          <div className="bg-slate-50 px-6 py-4.5 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 text-xs font-sans text-slate-500">
            <div className="flex items-start gap-2 max-w-[75%]">
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-700">Anthropic Original Context: </strong>
                {selectedModule.anthropicContext}
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-mono font-medium self-start sm:self-auto">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> {selectedModule.behaviorBenefit}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
