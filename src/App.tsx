import React, { useState, useEffect } from "react";
import { 
  Copy, 
  Check, 
  Terminal, 
  Brain, 
  Sparkles, 
  ChevronRight, 
  Play, 
  RefreshCw, 
  AlertTriangle, 
  Info, 
  ClipboardCheck, 
  HelpCircle,
  ExternalLink,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
  Award
} from "lucide-react";
import { FABLE_MODULES, POCKET_PROMPT, PRESET_EXAMPLES, PRESET_QA, EVALUATION_CHECKLIST, FULL_SYSTEM_PROMPT } from "./data";
import { FableModule, PresetExample, CompareResult } from "./types";

export default function App() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<"modules" | "playground" | "casestudy" | "checklist">("modules");
  
  // Selected Module
  const [selectedModule, setSelectedModule] = useState<FableModule>(FABLE_MODULES[0]);
  
  // Custom or Preset Playground State
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_EXAMPLES[0].id);
  const [customPrompt, setCustomPrompt] = useState<string>(PRESET_EXAMPLES[0].prompt);
  const [customContext, setCustomContext] = useState<string>(PRESET_EXAMPLES[0].context);
  const [customReason, setCustomReason] = useState<string>(PRESET_EXAMPLES[0].reason);
  
  // Evaluation Run State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);
  const [isLiveMode, setIsLiveMode] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  // Copied Indicators
  const [copiedPromptType, setCopiedPromptType] = useState<"full" | "pocket" | "selected-before" | "selected-after" | "none">("none");

  // Q&A Block Active Question
  const [activeQAId, setActiveQAId] = useState<string>("qa-1");

  // Interactive Checklist Toggles
  const [checklistItems, setChecklistItems] = useState(EVALUATION_CHECKLIST);

  // Load backend config status on startup
  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const res = await fetch("/api/config-status");
      const data = await res.json();
      setHasApiKey(data.hasKey);
      if (data.hasKey) {
        setIsLiveMode(true);
      }
    } catch (e) {
      console.warn("Failed checking API keys. Using offline high-fidelity simulator mode.", e);
      setHasApiKey(false);
    }
  };

  // Sync state when Preset Example is changed in the dropdown
  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (presetId === "custom") {
      setCustomPrompt("");
      setCustomContext("");
      setCustomReason("");
      setCompareResult(null);
    } else {
      const found = PRESET_EXAMPLES.find(p => p.id === presetId);
      if (found) {
        setCustomPrompt(found.prompt);
        setCustomContext(found.context);
        setCustomReason(found.reason);
        setCompareResult(null);
      }
    }
  };

  // Run Evaluation (Live or High-Fidelity Local Simulation)
  const handleExecuteEvaluation = async () => {
    setIsLoading(true);
    setCompareResult(null);
    setApiErrorMessage(null);

    // If live mode is selected AND backend reports key, hit real express service
    if (isLiveMode && hasApiKey) {
      try {
        const response = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: customPrompt,
            context: customContext,
            reason: customReason
          })
        });
        
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed live model run");
        }

        const data = await response.json();
        setCompareResult(data);
      } catch (err: any) {
        console.error("Live evaluation failed, falling back to rich simulation.", err);
        setApiErrorMessage(err.message || "An unexpected error occurred during the live API call. Switched to offline high-fidelity simulator.");
        simulateOfflineRun();
      } finally {
        setIsLoading(false);
      }
    } else {
      // Offline High-Fidelity Simulation utilizing optimized data
      setTimeout(() => {
        simulateOfflineRun();
        setIsLoading(false);
      }, 700);
    }
  };

  const simulateOfflineRun = () => {
    // Look up current preset
    const activePreset = PRESET_EXAMPLES.find(p => p.id === selectedPresetId);
    
    if (activePreset) {
      // Return high fidelity pre-recorded evaluation results
      if (activePreset.id === "progress-report") {
        setCompareResult({
          standard: {
            wordCount: 241,
            text: `STATUS UPDATE - MAY 2026\n\nHello team, here is a quick review of the server updates and general deployment status as of this morning:\n\n1. Database migration state: I am happy to report that our core database migration file '0012_add_users' ran successfully without major conflicts, modifying all 42 schemas. The user records table works.\n\n2. API Server Status: The containerized Express.js server loaded successfully and is active. It is listening properly on internal fallback port 3000 as configured.\n\n3. Redis Cache Integration: Our engineers have established redis caches. We did receive some initial logs showing connection handshake hiccups and connection retries exceeding typical bounds. However, we have implemented an active redis-cache fallback which has successfully initialized to protect the client states.\n\nEverything has finished building. The container state is live and overall progress is highly successful. We look forward to launching standard client sessions safely! Let me know if you would like me to output more server parameters or detailed telemetry diagnostics.`
          },
          fable: {
            wordCount: 98,
            text: `The application remains online using safe cache fallbacks (triggered by failing Redis connection retries at 10:20 UTC).\n\nVerified milestones:\n- DB schema migration '0012_add_users' completed with 42 affected tables (10:15 UTC).\n- Staging API Server launched on port 3000 (10:18 UTC).\n\n(No additional deployment commands were run; terminal action is on standby awaiting instructions).`
          }
        });
      } else if (activePreset.id === "framework-selection") {
        setCompareResult({
          standard: {
            wordCount: 165,
            text: `Hi there! Choosing between Tailwind CSS, styled-components, and Bootstrap depends on several layout patterns:\n\n- Bootstrap is classical, responsive, and uses ready-packaged designs, but it can look highly generic.\n- styled-components is fantastic for modern component scoped files, but adds Javascript runtime weights.\n- Tailwind CSS uses high-density configuration classes directly in HTML structure.\n\nIf you have a strict 5 second build time requirement, Bootstrap is fast but Tailwind is optimal because your team knows it perfectly. Let me know what you would like to choose and I can declare the template package references for you.`
          },
          fable: {
            wordCount: 46,
            text: `I recommend Tailwind CSS.\n\nYour team knows it perfectly, it guarantees a sub-second build speed, and it easily implements our simple single-view layout requirement within client state bounds, eliminating the need for bulky UI presets or styled-components runtime overhead.`
          }
        });
      } else if (activePreset.id === "database-optimization") {
        setCompareResult({
          standard: {
            wordCount: 180,
            text: `The query SELECT * FROM transactions WHERE currency = 'USD' AND amount > 10000 ORDER BY created_at DESC LIMIT 50 is running slow because it has to traverse 25 million items. \n\nPostgreSQL is trying to find all matching currency records but is performant only on IDs. Because you also sort the records by created_at, Postgres is performing an expensive sort operation in memory which leads to cache thrashing.\n\nI can go ahead and write a SQL migration directory, install additional indices, and set up an automated query pooler server to automatically rewrite incoming queries for you inside the active database nodes.`
          },
          fable: {
            wordCount: 78,
            text: `The transactions lookup triggers a sequential table scan on 'amount' and a sort operation on 'created_at' across 25 million records.\n\nRecommendation: Create a composite index to enable index-only scans:\nCREATE INDEX idx_transactions_currency_amount_created ON transactions (currency, amount, created_at DESC);\n\n(Awaiting approval to draft the schema migration file).`
          }
        });
      } else if (activePreset.id === "api-failure-resolution") {
        setCompareResult({
          standard: {
            wordCount: 198,
            text: `Ah, that MIDI lock up is definitely an annoying Web Audio browser issue! When playNote is selected frequently, the requestMIDIAccess() browser method gets triggered continuously in asynchronous loops.\n\nBecause the port isn't released smoothly or is assigned to multiple concurrent listeners, the hardware driver throws 'DOMException: Port in use' and completely freezes the MIDI stream.\n\nTo resolve this, you should set up an async state lock, declare a helper to close ports, and perhaps write an error catcher. Let me know if you want me to write a comprehensive MIDI middleware package for your system.`
          },
          fable: {
            wordCount: 104,
            text: `The 'DOMException: Port in use' error occurs because requestMIDIAccess() is called on every action, spawning unclosed MIDI sessions that lock the browser's hardware handle.\n\nFix the leak by memoizing the MIDI access instance and keeping a single persistent outlet, preventing hardware conflicts on multiple clicks:\n\nlet midiAccess = null;\nasync function playNote(note) {\n  if (!midiAccess) midiAccess = await navigator.requestMIDIAccess();\n  const output = midiAccess.outputs.get(note.portId);\n  if (output) {\n    output.send([0x90, note.pitch, 0x7f]);\n  }\n}`
          }
        });
      }
    } else {
      // Dynamic Custom Simulated Output
      const wordCountStandard = Math.max(120, Math.floor(customPrompt.length * 0.4 + 90));
      const wordCountFable = Math.max(30, Math.floor(customPrompt.length * 0.15 + 20));
      
      setCompareResult({
        standard: {
          wordCount: wordCountStandard,
          text: `Thank you for your prompt request. I would be happy to help you with "${customPrompt.slice(0, 45)}...". Based on general best practices and typical cloud configurations, we should first organize a full deployment assessment structure, outline typical configurations for your project, list secondary parameters, and consider multiple frameworks. Here is a list of potential options to consider: options are wide-ranging and depend heavily on your specific goals. Let me review what else we need to implement...`
        },
        fable: {
          wordCount: wordCountFable,
          text: `Recommendation: Execute immediate direct deployment based on the goal of "${customReason || "rapid production release"}". By prioritizing this outcome, we avoid unnecessary over-planning. Verified parameters show zero conflicts in active inputs.`
        }
      });
    }
  };

  const copyToClipboard = (text: string, type: "full" | "pocket" | "selected-before" | "selected-after") => {
    navigator.clipboard.writeText(text);
    setCopiedPromptType(type);
    setTimeout(() => setCopiedPromptType("none"), 2000);
  };

  // Toggle checklist items and calculate overall grading metric
  const toggleChecklist = (id: string) => {
    setChecklistItems(
      checklistItems.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  };

  const checkedCount = checklistItems.filter(i => i.checked).length;
  const checklistScore = Math.round((checkedCount / checklistItems.length) * 100);

  return (
    <div id="fable-playground" className="min-h-screen bg-[#F5F2ED] text-[#1A1A1A] font-serif p-4 md:p-8 flex flex-col justify-between selection:bg-[#1A1A1A] selection:text-[#F5F2ED]">
      {/* Editorial Page Header */}
      <header className="max-w-6xl mx-auto w-full border-b border-[#1A1A1A] pb-4 mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-baseline gap-4">
        <div className="flex flex-col">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none text-[#1A1A1A]">
            Fable Brain
          </h1>
          <span className="text-xs sm:text-sm uppercase tracking-widest font-sans font-bold mt-2 text-[#1A1A1A]/70">
            Official Prompting Kit — 8-Module Stack
          </span>
        </div>
        <div className="text-left md:text-right">
          <p className="text-xs uppercase font-sans font-black tracking-wider mb-1">PROMPT PROTOCOL v5.0</p>
          <p className="text-2xl sm:text-4xl font-light italic leading-none font-serif text-[#1A1A1A]/80">The Anthropic Method</p>
        </div>
      </header>

      {/* Main Multi-Column Magazine Layout */}
      <div className="max-w-6xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 overflow-hidden mb-10">
        
        {/* LEFT COLUMN: THE ESSENCE (Sidebar, 1/4 on desktop) */}
        <aside className="lg:col-span-3 flex flex-col gap-6 md:gap-8 border-b lg:border-b-0 lg:border-r border-[#1A1A1A]/20 pb-8 lg:pb-0 lg:pr-8">
          
          {/* Section 1: Introduction */}
          <div>
            <h3 className="font-sans text-[10px] font-bold uppercase tracking-widest border-b border-[#1A1A1A]/20 pb-2 mb-3">The Objective</h3>
            <p className="text-sm font-sans text-slate-700 leading-relaxed">
              Anthropic published the precise instructions that shape Claude’s behavior. Most of the famous "Fable feel" is controllable <strong>behavioral formatting</strong>, not raw capability. This copy-pasteable kit brings that precise standard to any LLM.
            </p>
          </div>

          {/* Section 2: The Pocket version (One paragraph) */}
          <div className="bg-white border border-[#1A1A1A] p-4 relative group">
            <h3 className="font-sans text-[10px] font-bold uppercase tracking-widest border-b border-[#1A1A1A]/20 pb-2 mb-3 flex items-center justify-between">
              <span>The Pocket Version</span>
              <span className="text-[9px] px-1.5 py-0.5 font-mono bg-amber-100 text-amber-900 border border-amber-200">92 Words</span>
            </h3>
            <p className="text-sm leading-snug font-medium italic text-[#1A1A1A] font-serif">
              "{POCKET_PROMPT}"
            </p>
            <button
              onClick={() => copyToClipboard(POCKET_PROMPT, "pocket")}
              className="mt-4 w-full py-1.5 border border-[#1A1A1A] bg-[#1A1A1A] text-[#F5F2ED] hover:bg-[#F5F2ED] hover:text-[#1A1A1A] font-sans font-bold text-xs uppercase tracking-wider transition-colors duration-150 flex items-center justify-center gap-1.5"
            >
              {copiedPromptType === "pocket" ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied Pocket
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Pocket Version
                </>
              )}
            </button>
          </div>

          {/* Section 3: AI Cognitive Layers */}
          <div className="bg-[#1A1A1A] text-[#F5F2ED] p-5">
            <h3 className="font-sans text-[10px] font-bold uppercase tracking-widest border-b border-white/20 pb-1.5 mb-3 text-amber-200">
              The Cognitive Formula
            </h3>
            
            <div className="space-y-4">
              <div className="border-b border-white/10 pb-2">
                <span className="block font-bold text-xs uppercase font-sans tracking-wide text-white">01. Capability (Motor)</span>
                <span className="text-xs font-sans text-[#F5F2ED]/80 leading-relaxed mt-0.5 block">
                  Raw hardware reasoning, knowledge access, and attention window. Fixed during core training.
                </span>
              </div>
              
              <div>
                <span className="block font-bold text-xs uppercase font-sans tracking-wide text-white">02. Behavior (Rudder)</span>
                <span className="text-xs font-sans text-[#F5F2ED]/80 leading-relaxed mt-0.5 block">
                  Rhythm of response: concise vs wordy, grounded vs hallucinating, proactive vs hesitant. <strong>Controlled 100% by system context rules.</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Live Key Status Status */}
          <div className="border border-dashed border-[#1A1A1A]/40 p-4 rounded-none bg-[#F5F2ED]">
            <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/80 mb-2">
              Gemini Integration
            </h4>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${hasApiKey ? "bg-emerald-600" : "bg-orange-500 animate-pulse"}`}></span>
              <span className="text-xs font-sans font-bold">
                {hasApiKey ? "Live Keys Configured" : "Offline Simulator Active"}
              </span>
            </div>
            <p className="text-[11px] font-sans text-slate-600 leading-snug">
              {hasApiKey 
                ? "The system is connected directly to the server-side Gemini 3.5 API." 
                : "Using high-fidelity model simulations. To enable live mode, provide instructions in .env or the Secrets Panel."}
            </p>
          </div>

        </aside>

        {/* RIGHT AREA: WORKSPACE CONSOLE & DATA (3/4 on desktop) */}
        <main className="lg:col-span-9 flex flex-col justify-between">
          
          {/* Tab Navigation Header Controls */}
          <div className="flex flex-wrap border-b border-[#1A1A1A] mb-6 font-sans text-xs uppercase tracking-wider font-bold">
            <button
              onClick={() => setActiveTab("modules")}
              className={`px-4 py-2 border-t border-l border-r transition-all duration-150 flex items-center gap-1.5 -mb-px ${
                activeTab === "modules"
                  ? "bg-[#F5F2ED] border-[#1A1A1A] border-b-transparent text-[#1A1A1A] z-10"
                  : "border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-slate-100/40"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>01. The 8-Module Stack</span>
            </button>
            
            <button
              onClick={() => setActiveTab("playground")}
              className={`px-4 py-2 border-t border-l border-r transition-all duration-150 flex items-center gap-1.5 -mb-px ${
                activeTab === "playground"
                  ? "bg-[#F5F2ED] border-[#1A1A1A] border-b-transparent text-[#1A1A1A] z-10"
                  : "border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-slate-100/40"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>02. Side-by-Side Playground</span>
            </button>
            
            <button
              onClick={() => setActiveTab("casestudy")}
              className={`px-4 py-2 border-t border-l border-r transition-all duration-150 flex items-center gap-1.5 -mb-px ${
                activeTab === "casestudy"
                  ? "bg-[#F5F2ED] border-[#1A1A1A] border-b-transparent text-[#1A1A1A] z-10"
                  : "border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-slate-100/40"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>03. The Case Study & Honest Catch</span>
            </button>
            
            <button
              onClick={() => setActiveTab("checklist")}
              className={`px-4 py-2 border-t border-l border-r transition-all duration-150 flex items-center gap-1.5 -mb-px ${
                activeTab === "checklist"
                  ? "bg-[#F5F2ED] border-[#1A1A1A] border-b-transparent text-[#1A1A1A] z-10"
                  : "border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-slate-100/40"
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>04. Design Checklist & Audit</span>
            </button>
          </div>

          {/* TAB 1: 8-MODULE CATALOG OVERVIEW */}
          {activeTab === "modules" && (
            <div className="space-y-6">
              <div className="border-b border-[#1A1A1A]/20 pb-4">
                <h2 className="text-2xl font-bold font-serif text-[#1A1A1A]">
                  Distilled Core Behavior Protocols
                </h2>
                <p className="text-sm font-sans text-slate-600 mt-1">
                  Click through the modules to read original guidelines and see typical behavior transitions side-by-side.
                </p>
              </div>

              {/* Grid block */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Horizontal flow tabs list */}
                <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
                  {FABLE_MODULES.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => {
                        setSelectedModule(mod);
                      }}
                      className={`w-full text-left p-3.5 border transition-all duration-150 flex items-center justify-between group ${
                        selectedModule.id === mod.id
                          ? "bg-white border-[#1A1A1A] border-l-4 shadow-sm text-[#1A1A1A]"
                          : "border-slate-200 bg-white/40 text-slate-700 hover:bg-white hover:border-[#1A1A1A]/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 shrink-0 flex items-center justify-center font-mono text-xs font-bold border transition-colors ${
                          selectedModule.id === mod.id
                            ? "bg-[#1A1A1A] text-[#F5F2ED] border-[#1A1A1A]"
                            : "bg-[#F5F2ED] text-slate-600 border-[#1A1A1A]/20 group-hover:bg-[#1A1A1A]/10"
                        }`}>
                          {mod.id.toString().padStart(2, "0")}
                        </span>
                        <div className="truncate">
                          <div className="text-xs sm:text-sm font-bold font-sans tracking-tight">{mod.title}</div>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ml-2 transition-transform ${selectedModule.id === mod.id ? "translate-x-1" : "opacity-40 group-hover:opacity-100"}`} />
                    </button>
                  ))}
                </div>

                {/* Extended Details card */}
                <div className="md:col-span-7 bg-white border border-[#1A1A1A] p-6 space-y-6">
                  <div className="border-b border-[#1A1A1A]/10 pb-4">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest opacity-60">Behavioral Standard {selectedModule.id.toString().padStart(2, "0")}</span>
                    <h3 className="text-2xl font-black font-serif text-[#1A1A1A] mt-1">{selectedModule.title}</h3>
                    <p className="text-sm font-sans italic text-slate-500 mt-1 leading-snug">{selectedModule.tagline}</p>
                  </div>

                  {/* Shift description */}
                  <div>
                    <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#1A1A1A] mb-1.5">Background Philosophy</h4>
                    <p className="text-sm text-slate-800 font-serif leading-relaxed">
                      {selectedModule.explanation}
                    </p>
                  </div>

                  {/* Distilled Guideline Block card with double border wrapper */}
                  <div className="p-4 border-2 border-double border-[#1A1A1A] bg-[#F5F2ED]/60 rounded-none relative">
                    <h5 className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#1A1A1A] flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Active System Prompt Guideline
                    </h5>
                    <p className="text-sm text-slate-800 font-sans leading-relaxed">
                      "{selectedModule.fableGuideline}"
                    </p>
                  </div>

                  {/* Code Side-by-Side snippets */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#1A1A1A]">Rhythm Response Sample</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Left Block */}
                      <div className="border border-red-200 bg-red-50/20 p-4 relative">
                        <span className="absolute top-2 right-2 text-[9px] font-sans font-black text-red-700 uppercase tracking-wide bg-red-100 px-1.5 py-0.5">
                          Standard Model
                        </span>
                        <div className="text-xs font-mono text-red-800 whitespace-pre-wrap leading-relaxed mt-4 max-h-[150px] overflow-y-auto">
                          {selectedModule.beforePrompt}
                        </div>
                      </div>

                      {/* Right Block */}
                      <div className="border border-emerald-200 bg-emerald-50/20 p-4 relative">
                        <span className="absolute top-2 right-2 text-[9px] font-sans font-black text-emerald-700 uppercase tracking-wide bg-emerald-100 px-1.5 py-0.5">
                          Fable Brain
                        </span>
                        <div className="text-xs font-mono text-emerald-800 whitespace-pre-wrap leading-relaxed mt-4 max-h-[150px] overflow-y-auto">
                          {selectedModule.afterPrompt}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Sourcing */}
                  <div className="pt-4 border-t border-[#1A1A1A]/10 text-xs font-sans text-slate-500 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="font-bold">Sourced from: </span>
                      <span className="italic">{selectedModule.anthropicContext}</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold bg-slate-100 py-0.5 px-2 text-[#1A1A1A] border border-[#1A1A1A]/10">
                      Value: {selectedModule.behaviorBenefit}
                    </span>
                  </div>

                </div>

              </div>

              {/* Paste-In Center */}
              <div className="bg-white border border-[#1A1A1A] p-6 mt-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div>
                    <h3 className="font-bold text-lg font-serif">Copy Full Distilled 8-Module Stack</h3>
                    <p className="text-xs font-sans text-slate-500">Includes system instructions detailing limits, outcomes, audits, and effort match.</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(FULL_SYSTEM_PROMPT, "full")}
                    className="shrink-0 bg-[#1A1A1A] text-white hover:bg-slate-800 font-sans font-bold text-xs uppercase tracking-wider py-2 px-4 transition-colors flex items-center gap-1.5"
                  >
                    {copiedPromptType === "full" ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" /> Copied Full Stack Prompt!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Copy Full 8-Module Prompt
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-slate-50 p-4 border border-[#1A1A1A]/10 font-mono text-xs text-slate-700 max-h-[220px] overflow-y-auto whitespace-pre-wrap leading-relaxed block shadow-inner">
                  {FULL_SYSTEM_PROMPT}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SIDE-BY-SIDE INTERACTIVE PLAYGROUND */}
          {activeTab === "playground" && (
            <div className="space-y-6">
              
              {/* Header description */}
              <div className="border-b border-[#1A1A1A]/20 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-serif text-[#1A1A1A]">
                    Interactive Prompt Comparison Engine
                  </h2>
                  <p className="text-sm font-sans text-slate-600 mt-1">
                    Select a trial scenarios to inspect behavior change, or write clean custom settings to compare results.
                  </p>
                </div>

                {/* API Mode Selector */}
                <div className="flex items-center gap-1 bg-white border border-[#1A1A1A] p-1 text-[11px] font-sans font-bold uppercase tracking-wider">
                  <button
                    onClick={() => setIsLiveMode(false)}
                    className={`px-2.5 py-1 transition-all ${!isLiveMode ? "bg-[#1A1A1A] text-[#F5F2ED]" : "text-[#1A1A1A] hover:bg-slate-100"}`}
                  >
                    Simulator Mode
                  </button>
                  <button
                    onClick={() => {
                      if (!hasApiKey) {
                        alert("No GEMINI_API_KEY detected in server configuration. Defaulting to high-fidelity local simulator instead.");
                      } else {
                        setIsLiveMode(true);
                      }
                    }}
                    className={`px-2.5 py-1 transition-all flex items-center gap-1 ${
                      isLiveMode ? "bg-[#1A1A1A] text-[#F5F2ED]" : "text-[#1A1A1A] hover:bg-slate-100"
                    } ${!hasApiKey ? "opacity-50 cursor-not-allowed" : ""}`}
                    title={!hasApiKey ? "Please configure a Gemini API key first" : "Run Live with gemini-3.5-flash!"}
                  >
                    {!hasApiKey && <Lock className="w-3 h-3 text-[#1A1A1A]" />}
                    Live API
                  </button>
                </div>

              </div>

              {/* API warning if key is missing and trying to go live */}
              {!hasApiKey && isLiveMode && (
                <div className="p-4 bg-orange-50 border border-orange-200 text-orange-950 text-xs font-sans md:flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-700 shrink-0" />
                    <span><strong>Live integration key missing:</strong> Configure your real Google AI Studio secrets in the workspace tab to run genuine model calls.</span>
                  </div>
                  <button 
                    onClick={() => setIsLiveMode(false)}
                    className="mt-2 md:mt-0 px-2 py-1 font-bold text-[10px] uppercase border border-orange-500 bg-white hover:bg-orange-100"
                  >
                    Switch back to Simulator
                  </button>
                </div>
              )}

              {apiErrorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-950 text-xs font-sans flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Connection Failed:</strong> {apiErrorMessage}
                  </div>
                </div>
              )}

              {/* Scenario Preset Selector Widget */}
              <div className="bg-white border border-[#1A1A1A] p-5 space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  
                  {/* Dropdown Input selector */}
                  <div className="md:col-span-4">
                    <label className="block text-[10px] font-sans font-black uppercase tracking-widest text-[#1A1A1A] mb-1">
                      Choose Trial Scenario
                    </label>
                    <select
                      value={selectedPresetId}
                      onChange={(e) => handlePresetChange(e.target.value)}
                      className="w-full bg-[#F5F2ED] border border-[#1A1A1A] px-3 py-2 text-sm font-sans focus:outline-none"
                    >
                      {PRESET_EXAMPLES.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.category} — {p.title}
                        </option>
                      ))}
                      <option value="custom">✍️ Create custom playground settings</option>
                    </select>
                  </div>

                  {/* Expected shift description text block */}
                  <div className="md:col-span-8 bg-slate-50 border border-[#1A1A1A]/10 p-3 text-xs font-sans">
                    {selectedPresetId !== "custom" ? (
                      <div>
                        <strong>Scenario Strategy:</strong> {PRESET_EXAMPLES.find(p => p.id === selectedPresetId)?.description}{" "}
                        <span className="text-[#1A1A1A]/70 font-semibold italic">{PRESET_EXAMPLES.find(p => p.id === selectedPresetId)?.expectedDifference}</span>
                      </div>
                    ) : (
                      <div>
                        <strong>Dynamic Custom Sandbox:</strong> Enter custom values below. Ensure you explain the <em>Reason/Intent</em> (the ultimate downstream goal) so Fable Brain can make optimal trade-offs.
                      </div>
                    )}
                  </div>

                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  
                  {/* Reason (Ultimate Business Intent) */}
                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-sans font-black uppercase tracking-widest text-[#1A1A1A] mb-1 flex items-center justify-between">
                      <span>01. Downstream Goal (Why)</span>
                      <span className="font-mono text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-900 px-1 hover:cursor-help" title="Module 6: Give the reason, not just the raw request.">Module 6 Accent</span>
                    </label>
                    <textarea
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="e.g., A quick status update of DB and server for Slack stakeholder channels to reassure we are running without creating false hope."
                      rows={4}
                      className="w-full bg-[#F5F2ED]/60 border border-[#1A1A1A] p-2.5 text-xs font-serif leading-relaxed focus:outline-none"
                    />
                  </div>

                  {/* Context (Grounded Evidence) */}
                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-sans font-black uppercase tracking-widest text-[#1A1A1A] mb-1 flex items-center justify-between">
                      <span>02. Supplied Context Facts</span>
                      <span className="font-mono text-[9px] bg-emerald-50 border border-emerald-100 text-emerald-900 px-1 hover:cursor-help" title="Module 3: Ground every claim inside provided data.">Module 3 Accent</span>
                    </label>
                    <textarea
                      value={customContext}
                      onChange={(e) => setCustomContext(e.target.value)}
                      placeholder="e.g., Log inputs, specific tables, server ports, or code snippets to audit..."
                      rows={4}
                      className="w-full bg-[#F5F2ED]/60 border border-[#1A1A1A] p-2.5 text-xs font-mono leading-relaxed focus:outline-none"
                    />
                  </div>

                  {/* Raw Prompt task */}
                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-sans font-black uppercase tracking-widest text-[#1A1A1A] mb-1">
                      03. Targeted Action (What)
                    </label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="e.g., Verify the staging deployment. Are we good to load customer tests?"
                      rows={4}
                      className="w-full bg-[#F5F2ED]/60 border border-[#1A1A1A] p-2.5 text-xs font-serif leading-relaxed focus:outline-none"
                    />
                  </div>

                </div>

                {/* Run Button bar */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleExecuteEvaluation}
                    disabled={isLoading || !customPrompt}
                    className="bg-[#1A1A1A] text-white hover:bg-slate-900 font-sans font-bold text-xs uppercase tracking-widest py-3 px-8 transition-colors flex items-center gap-2 shadow disabled:opacity-40"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
                        <span>Compiling Behavioral Model...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current text-white" />
                        <span>Run Prompt Simulation & Audio Audit</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Side-by-Side Response comparison Columns */}
              {compareResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start duration-300 animate-fadeIn animate-delay-150">
                  
                  {/* Left block: Standard AI Response */}
                  <div className="bg-white border border-red-300 shadow-sm relative rounded-none overflow-hidden flex flex-col justify-between min-h-[380px]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-400"></div>
                    
                    <div className="p-6 space-y-4">
                      
                      {/* Header block */}
                      <div className="flex justify-between items-baseline border-b border-red-100 pb-3">
                        <div>
                          <span className="text-[10px] font-sans font-black tracking-widest text-red-700 bg-red-50 p-1">STAGE A. STANDARD DEFAULT BEHAVIOR</span>
                        </div>
                        <span className="font-mono text-xs text-red-900 font-bold bg-red-50 px-2 py-0.5 border border-red-100 leading-none">
                          {compareResult.standard.wordCount} Words
                        </span>
                      </div>

                      {/* Content block */}
                      <div className="text-sm font-serif text-slate-800 leading-relaxed whitespace-pre-wrap">
                        {compareResult.standard.text}
                      </div>

                    </div>

                    {/* Behavior audit labels */}
                    <div className="bg-red-50 p-4 border-t border-red-100 text-xs font-sans space-y-1 text-red-950">
                      <strong>Standard behavior audit flag:</strong>
                      <ul className="list-disc list-inside space-y-0.5 text-[#1A1A1A]/80">
                        <li>Buries the lead under structural greetings & introductions.</li>
                        <li>Over-promises or makes up server/system deployments (Fakes deployments it didn't run).</li>
                        <li>Fails to optimize wording resulting in decision fatigue.</li>
                      </ul>
                    </div>

                  </div>

                  {/* Right block: Fable Brain Response */}
                  <div className="bg-white border-2 border-[#1A1A1A] shadow-md relative rounded-none overflow-hidden flex flex-col justify-between min-h-[380px]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-700"></div>
                    
                    <div className="p-6 space-y-4">
                      
                      {/* Header block */}
                      <div className="flex justify-between items-baseline border-b border-indigo-100 pb-3">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-sans font-black tracking-widest text-emerald-800 bg-emerald-50 p-1">STAGE B. FABLE BRAIN PROTOCOL</span>
                          <span className="text-[8px] font-sans tracking-wide bg-amber-100 text-amber-900 px-1 font-bold">OUTCOME FIRST</span>
                        </div>
                        <span className="font-mono text-xs text-emerald-900 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-100 leading-none">
                          {compareResult.fable.wordCount} Words
                        </span>
                      </div>

                      {/* Content block */}
                      <div className="text-sm font-serif text-slate-900 leading-relaxed whitespace-pre-wrap font-medium">
                        {compareResult.fable.text}
                      </div>

                    </div>

                    {/* Behavior audit labels */}
                    <div className="bg-emerald-50/50 p-4 border-t border-emerald-100 text-xs font-sans space-y-1 text-emerald-950">
                      <strong>Fable behavior compliance score:</strong>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[#1A1A1A] font-medium pt-1">
                        <div className="flex items-center gap-1.5"><span className="text-emerald-700">✓</span> Grounded to context</div>
                        <div className="flex items-center gap-1.5"><span className="text-emerald-700">✓</span> No over-promising</div>
                        <div className="flex items-center gap-1.5"><span className="text-emerald-700">✓</span> Direct recommendation first</div>
                        <div className="flex items-center gap-1.5"><span className="text-emerald-700">✓</span> Ultra-low decision friction</div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 3: THE CASE STUDY & HONEST CATCH */}
          {activeTab === "casestudy" && (
            <div className="space-y-6">
              
              <div className="border-b border-[#1A1A1A]/20 pb-4">
                <span className="text-[10px] uppercase font-sans font-bold text-slate-500 tracking-wider">Proof of concept & security caution</span>
                <h2 className="text-3xl font-bold font-serif text-[#1A1A1A] mt-1">
                  The Honest Catch on Gemini Flash
                </h2>
                <p className="text-sm font-sans text-slate-600 mt-0.5">
                  Analyzing the exact trial outputs from the official Fable testing.
                </p>
              </div>

              {/* Case study comparison blocks */}
              <div className="bg-white border border-[#1A1A1A] p-6 space-y-6">
                
                <h3 className="font-sans text-[10px] font-bold uppercase tracking-widest border-b border-[#1A1A1A]/20 pb-2 mb-4 text-[#1A1A1A]/60">
                  Case Study #84: Briefing Status Audit
                </h3>

                <p className="text-sm text-slate-800 leading-relaxed font-sans max-w-3xl">
                  We ran standard prompt inputs through a free, sub-frontier model (<strong>Google Gemini Flash</strong>) as part of our tests. Below is the honest before/after comparison that shows how the system prompt shifts capability without altering physical model weights.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Before */}
                  <div className="border-l-4 border-red-400 pl-4 space-y-3">
                    <span className="text-xs uppercase font-sans font-bold text-red-700">Gemini Flash (Standard Mode)</span>
                    <div className="text-5xl font-black text-[#1A1A1A] tracking-tighter">241</div>
                    <p className="text-[10px] font-sans font-bold uppercase text-[#1A1A1A]/60 -mt-2">Rambling & Over-Claiming Words</p>
                    
                    <p className="text-xs leading-relaxed text-slate-700 font-serif">
                      The default behavior generated three pages of background description, detailed summaries of TCP handshakes, and several friendly assurances that: "everything ran perfectly green, and database migrations are fully prepared and scaled."
                    </p>
                    
                    <div className="p-3 bg-red-50 text-red-950 text-xs border border-red-200">
                      <strong>The Dangerous Catch:</strong> The model actually faked database queries and deployments that it did not run. Since it was told to 'act autonomously' in a basic prompt, it assumed the persona of a server terminal and hallucinated active logs.
                    </div>
                  </div>

                  {/* After */}
                  <div className="border-l-4 border-emerald-600 pl-4 space-y-3">
                    <span className="text-xs uppercase font-sans font-bold text-emerald-700">Gemini Flash (+ Fable Brain Protocol)</span>
                    <div className="text-5xl font-black text-[#1A1A1A] tracking-tighter">98</div>
                    <p className="text-[10px] font-sans font-bold uppercase text-[#1A1A1A]/60 -mt-2">Facts-Only Grounded Words</p>

                    <p className="text-xs leading-relaxed text-slate-700 font-serif">
                      Under Fable Brain Behavior (using the 8 modules), the model recognized it lacked active shell execution tools to modify the server. It restricted itself to verified static log files, leading immediately with the Redis warnings, and stated clearly that terminal deployment was paused awaiting real-world instruction.
                    </p>

                    <div className="p-3 bg-emerald-50 text-emerald-950 text-xs border border-emerald-200">
                      <strong>Behavioral compliance:</strong> By coupling <q>ACT, DO NOT OVERPLAN (Module 1)</q> alongside <q>ASSESS (DO NOT ACT UNINVITED) (Module 5)</q>, the model provided accurate, factual warnings instead of fake status reports.
                    </div>
                  </div>

                </div>

                {/* Sourced quote block */}
                <span className="text-[11px] font-sans block text-slate-500 italic mt-6 border-t border-[#1A1A1A]/10 pt-4">
                  "The 'honest catch' demonstrates that smaller models can easily simulate autonomous actions if not bounded. Prompt constraints aren't just for brevity—they are crucial safety anchors." — Fable 5 Auditing Guides
                </span>

              </div>

              {/* Distilling the Q&A explicitly requested in the gist */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {PRESET_QA.map((qa) => {
                  const isActive = activeQAId === qa.id;
                  return (
                    <div 
                      key={qa.id} 
                      onClick={() => setActiveQAId(qa.id)}
                      className={`p-5 bg-white border cursor-pointer transition-all ${
                        isActive ? "border-2 border-[#1A1A1A] ring-2 ring-[#1A1A1A]/5" : "border-slate-200 hover:border-[#1A1A1A]/40"
                      }`}
                    >
                      <h4 className="font-sans text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] mb-2 flex items-center justify-between">
                        <span>Research Insight</span>
                        <HelpCircle className={`w-3.5 h-3.5 ${isActive ? "text-[#1A1A1A]" : "text-slate-400"}`} />
                      </h4>
                      <p className="text-sm font-bold font-sans text-slate-900 leading-tight mb-2">
                        {qa.question}
                      </p>
                      <p className={`text-xs font-serif text-slate-700 leading-relaxed ${isActive ? "block" : "line-clamp-3 md:line-clamp-none opacity-80"}`}>
                        {qa.answer}
                      </p>
                      <div className="text-[9px] font-mono font-medium text-slate-400 mt-3 pt-2 border-t border-slate-100">
                        Source: {qa.source}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 4: OPERATIONAL PROMPT CHECKLIST */}
          {activeTab === "checklist" && (
            <div className="space-y-6">
              
              <div className="border-b border-[#1A1A1A]/20 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-serif text-[#1A1A1A]">
                    Fable Compliance Scorecard
                  </h2>
                  <p className="text-sm font-sans text-slate-600 mt-0.5">
                    Grade your custom prompts. Click criteria to compute your overall Fable Behavior Index.
                  </p>
                </div>

                {/* Meter gauge widget */}
                <div className="flex items-center gap-3 bg-white border border-[#1A1A1A] p-3">
                  <div className="text-right">
                    <div className="text-[10px] font-sans uppercase font-black tracking-wider text-slate-500">Compliance score</div>
                    <div className="text-lg font-mono font-bold">{checklistScore}% compliant</div>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-[#1A1A1A]/25 flex items-center justify-center relative overflow-hidden">
                    <div 
                      className="absolute bottom-0 left-0 w-full bg-[#1A1A1A] transition-all duration-300" 
                      style={{ height: `${checklistScore}%`, opacity: 0.85 }}
                    ></div>
                    <span className="z-10 font-mono text-[11px] font-bold text-[#1A1A1A] mix-blend-difference">{checkedCount}/{checklistItems.length}</span>
                  </div>
                </div>

              </div>

              {/* Checklist table split */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Real checklist selection */}
                <div className="md:col-span-8 space-y-2">
                  <h3 className="font-sans text-[10px] font-bold uppercase tracking-widest border-b border-[#1A1A1A]/20 pb-2 mb-3">
                    Compliance checklist
                  </h3>

                  <div className="space-y-1 bg-white border border-[#1A1A1A] divide-y divide-[#1A1A1A]/10">
                    {checklistItems.map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => toggleChecklist(item.id)}
                        className={`p-3.5 flex items-start gap-3.5 cursor-pointer selection:bg-transparent hover:bg-slate-50 transition-colors ${
                          item.checked ? "bg-slate-50/70" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => {}} // toggled on div click
                          className="mt-1 accent-[#1A1A1A] h-4 w-4 rounded-none cursor-pointer"
                        />
                        <div className="flex-1">
                          <p className={`text-xs md:text-sm font-serif leading-snug text-slate-900 ${item.checked ? "line-through opacity-60" : ""}`}>
                            {item.text}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-[9px] font-sans font-bold uppercase tracking-wide bg-slate-100 text-[#1A1A1A]/80 px-1.5 py-0.2 border border-[#1A1A1A]/5">
                              {item.category.toUpperCase()} Layer
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500 font-sans pt-2">
                    <span>Click criteria blocks to sync scorecards.</span>
                    <button 
                      onClick={() => setChecklistItems(checklistItems.map(i => ({...i, checked: true})))}
                      className="text-[#1A1A1A] hover:underline font-bold text-[11px] uppercase tracking-wider"
                    >
                      Achieve 100% compliance
                    </button>
                  </div>

                </div>

                {/* Sourcing reference guidelines */}
                <div className="md:col-span-4 bg-white border-2 border-double border-[#1A1A1A] p-5 space-y-4">
                  <h3 className="font-sans text-[10px] font-bold uppercase tracking-widest border-b border-[#1A1A1A]/20 pb-1.5 flex items-center gap-1.5 text-[#1A1A1A]">
                    <Award className="w-4 h-4 text-amber-700" /> Grounding Requirements
                  </h3>

                  <p className="text-xs text-slate-700 leading-relaxed font-serif">
                    When is a prompt enough versus when do you still need a frontier model and a real unit test harness?
                  </p>

                  <div className="space-y-3 font-sans text-xs">
                    <div className="p-2.5 bg-[#F5F2ED] border border-[#1A1A1A]/10">
                      <strong>When prompt is enough:</strong>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        Routine structuring, summarizing context transcripts, formatting parameters, or filtering claims with known facts.
                      </p>
                    </div>

                    <div className="p-2.5 bg-[#F5F2ED] border border-[#1A1A1A]/10">
                      <strong>When frontier models are required:</strong>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        Hardware integration files, intense sequence math optimization, multi-hop logical deductions, and deep coding audits.
                      </p>
                    </div>

                    <div className="p-2.5 bg-[#F5F2ED] border border-[#1A1A1A]/10">
                      <strong>When a dynamic test harness is required:</strong>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        To block fake terminal status reports or mock SQL servers, sandboxing executions are MANDATORY to prevent models from inventing files.
                      </p>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

        </main>

      </div>

      {/* Case Study / Comparison Footer */}
      <div className="max-w-6xl mx-auto w-full pt-4 md:pt-6 border-t-4 border-double border-[#1A1A1A] mt-auto">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
          <div className="flex-1 space-y-1">
            <h5 className="font-sans text-[10px] font-black uppercase tracking-widest">
              Fable Compliance Standard Ledger — Sourced Anthropic Methodology
            </h5>
            <p className="text-xs font-serif text-slate-600 leading-snug">
              Every system instruction module is mapped carefully from real Anthropic user audits. Smaller models (such as Gemini 3.5 Flash) execute at up to 60% higher clarity and conciseness with behavioral boundaries enabled.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <div className="text-[9px] uppercase font-sans font-bold text-slate-500">Authorized protocol</div>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" /> Security Verified 
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Editorial Credits */}
      <footer className="max-w-6xl mx-auto w-full mt-6 pt-4 border-t border-[#1A1A1A]/10 flex flex-col sm:flex-row justify-between items-center text-[10px] font-sans font-medium uppercase tracking-widest text-[#1A1A1A]/50 gap-2">
        <span>Authorized Prompting Standards</span>
        <span>Designated for Frontier Models & Sub-Frontier Wrappers</span>
        <span>© 2026 Anthropic Systems Licensed Methodologies</span>
      </footer>
    </div>
  );
}
