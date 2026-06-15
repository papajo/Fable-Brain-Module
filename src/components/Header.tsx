import React from "react";
import { Sparkles, Brain, Code } from "lucide-react";

export default function Header() {
  return (
    <header className="py-8 border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full">
                <Brain className="w-3.5 h-3.5" /> Anthropic Fable 5 Protocol
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full">
                <Sparkles className="w-3.5 h-3.5" /> Playable Kit
              </span>
            </div>
            <h1 id="main-title" className="text-3xl md:text-4xl font-sans font-extrabold tracking-tight text-slate-900">
              Fable Brain Kit
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl font-sans">
              Behavior is copy-pasteable. This kit distills Anthropic's official Fable 5 prompting guide into an interactive behavior stack and a paste-in system prompt.
            </p>
          </div>
          
          <div className="flex items-center gap-4 py-2 px-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="text-right">
              <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">Targeted Framework</div>
              <div className="text-sm font-sans font-semibold text-slate-800 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-slate-500" /> Multi-Model Compat
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
