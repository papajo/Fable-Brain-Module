import React, { useState } from "react";
import { Copy, Check, Terminal, ExternalLink, Pocket, HelpCircle } from "lucide-react";
import { FULL_SYSTEM_PROMPT, POCKET_PROMPT } from "../data";

export default function LibraryCopy() {
  const [activeTab, setActiveTab] = useState<"full" | "pocket">("full");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = activeTab === "full" ? FULL_SYSTEM_PROMPT : POCKET_PROMPT;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="font-sans font-bold text-slate-100">Fable Brain Prompt Library</h3>
            <p className="text-xs text-slate-400 font-mono">Paste these into any LLM System Prompt input</p>
          </div>
        </div>

        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-lg">
          <button
            onClick={() => { setActiveTab("full"); setCopied(false); }}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition ${
              activeTab === "full" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-100"
            }`}
          >
            8-Module Stack
          </button>
          <button
            onClick={() => { setActiveTab("pocket"); setCopied(false); }}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition flex items-center gap-1.5 ${
              activeTab === "pocket" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-100"
            }`}
          >
            <Pocket className="w-3.5 h-3.5" /> Pocket Prompt
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <div className="mb-4">
          {activeTab === "full" ? (
            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              This is the distilled <strong className="text-indigo-400 font-medium">8-Module behavior template</strong>.
              It sets strict boundaries, forces concise fact-based assertions, mandates decision reasoning, and
              prevents AI rambling.
            </p>
          ) : (
            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              This is the <strong className="text-indigo-400 font-medium">one-paragraph Pocket Version</strong>.
              Optimized for fast-paced chats, it compresses all 8 behavioral boundaries into a single high-density instruction.
            </p>
          )}
        </div>

        {/* Prompt Block */}
        <div className="relative group bg-slate-950 rounded-lg p-4 border border-slate-800 font-mono text-sm leading-relaxed overflow-x-auto max-h-[300px]">
          <pre className="whitespace-pre-wrap word-break-all text-slate-300 pr-12">
            {activeTab === "full" ? FULL_SYSTEM_PROMPT : POCKET_PROMPT}
          </pre>
          
          <button
            onClick={handleCopy}
            className="absolute top-4 right-4 p-2 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition shadow-sm flex items-center gap-1.5"
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-sans text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="text-xs font-sans">Copy Prompt</span>
              </>
            )}
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-5 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>Works with Google Gemini, Anthropic Claude, OpenAI models, and local LLMs.</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium cursor-help">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How behavior shapes capability</span>
          </div>
        </div>
      </div>
    </div>
  );
}
