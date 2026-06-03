import { useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";

const API = import.meta.env.VITE_API_URL || "";

function EditorPanel({ language, changeLanguage, code, setCode, selectedProblem, onMarkSolved, onSaveCode, progress }) {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiHint, setAiHint] = useState("");
  const [activeTab, setActiveTab] = useState("output");
  const [hintLevel, setHintLevel] = useState(1);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const languageMap = { javascript: 63, python: 71, java: 62, cpp: 54 };
  const isSolved = selectedProblem ? progress?.[selectedProblem._id]?.solved : false;

  /* RUN */
  const runCode = async () => {
    try {
      setLoading(true);
      setOutput("");
      setActiveTab("output");
      const response = await axios.post(`${API}/api/run`, {
        code, languageId: languageMap[language],
      });
      setOutput(
        response.data.stdout ||
        response.data.stderr ||
        response.data.compile_output ||
        "No output"
      );
      // Auto-save code when running
      if (selectedProblem) {
        onSaveCode(selectedProblem._id, code, hintLevel);
      }
    } catch {
      setOutput("Error running code. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  /* SUBMIT */
  const submitCode = async () => {
    try {
      setSubmitting(true);
      setSubmitSuccess(false);
      setActiveTab("output");
      const response = await axios.post(`${API}/api/run`, {
        code, languageId: languageMap[language],
      });
      const result = response.data.stdout || response.data.stderr || "No output";
      const statusDesc = response.data.status?.description || "Completed";

      setOutput(`Submission Result\n${"─".repeat(30)}\n${result}\nStatus: ${statusDesc}`);

      // Mark as solved and save to DB
      if (selectedProblem && response.data.status?.id === 3) {
        // status id 3 = Accepted in Judge0
        await onMarkSolved(selectedProblem._id, code, hintLevel);
        setSubmitSuccess(true);
      } else if (selectedProblem) {
        // Save code even if not accepted
        await onSaveCode(selectedProblem._id, code, hintLevel);
      }
    } catch {
      setOutput("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  /* AI HINT */
  const getAIHint = async () => {
    try {
      setAiLoading(true);
      setAiHint("");
      setActiveTab("ai");
      const response = await axios.post(`${API}/api/hint`, {
        code,
        problemTitle: selectedProblem?.title || "Unknown Problem",
        hintLevel,
      });
      setAiHint(response.data.hint || "No hint generated.");
      if (hintLevel < 3) setHintLevel(hintLevel + 1);
      // Save hint level progress
      if (selectedProblem) {
        onSaveCode(selectedProblem._id, code, hintLevel);
      }
    } catch {
      setAiHint("Failed to get hint. Make sure the server is running.");
    } finally {
      setAiLoading(false);
    }
  };

  /* EXPLAIN */
  const explainSolution = async () => {
    try {
      setAiLoading(true);
      setAiHint("");
      setActiveTab("ai");
      const response = await axios.post(`${API}/api/explain`, {
        code,
        problemTitle: selectedProblem?.title || "Unknown Problem",
      });
      setAiHint(response.data.explanation || "No explanation available.");
    } catch {
      setAiHint("Failed to explain. Make sure the server is running.");
    } finally {
      setAiLoading(false);
    }
  };

  const resetHints = () => { setHintLevel(1); setAiHint(""); };

  const hintConfig = [
    { label: "Hint",      icon: "💡", color: "bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 border-violet-500/20" },
    { label: "More Help", icon: "🔍", color: "bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/20" },
    { label: "Big Hint",  icon: "🧩", color: "bg-red-500/15 hover:bg-red-500/25 text-red-300 border-red-500/20" },
  ];
  const currentHint = hintConfig[hintLevel - 1];

  return (
    <div className="flex-1 flex flex-col bg-[#0d1117] min-w-0">

      {/* TOPBAR */}
      <div className="h-14 border-b border-white/5 px-4 flex items-center justify-between gap-3 shrink-0">

        {/* LEFT: title + solved badge */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium text-slate-300 truncate">
            {selectedProblem?.title || "AI DSA Mentor"}
          </span>
          {isSolved && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 font-medium shrink-0">
              ✓ Solved
            </span>
          )}
        </div>

        {/* RIGHT: controls */}
        <div className="flex items-center gap-2 shrink-0">

          {/* language */}
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="bg-white/5 border border-white/8 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg outline-none hover:border-white/15 transition-colors"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          {/* hint button */}
          <button
            onClick={getAIHint}
            disabled={aiLoading}
            title={`Level ${hintLevel}/3 — each click gives a bigger hint`}
            className={`border text-xs px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-40 flex items-center gap-1.5 ${currentHint.color}`}
          >
            <span>{currentHint.icon}</span>
            <span>{aiLoading ? "..." : currentHint.label}</span>
          </button>

          {/* reset hint */}
          {hintLevel > 1 && (
            <button
              onClick={resetHints}
              title="Reset hints"
              className="text-slate-500 hover:text-slate-300 text-sm px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all"
            >
              ↺
            </button>
          )}

          {/* explain */}
          <button
            onClick={explainSolution}
            disabled={aiLoading}
            className="bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/20 text-blue-300 text-xs px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-40"
          >
            Explain
          </button>

          {/* divider */}
          <div className="w-px h-5 bg-white/8" />

          {/* run */}
          <button
            onClick={runCode}
            disabled={loading}
            className="bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-300 text-xs px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-40"
          >
            {loading ? "Running..." : "▶ Run"}
          </button>

          {/* submit */}
          <button
            onClick={submitCode}
            disabled={submitting}
            className="bg-emerald-500 hover:bg-emerald-400 text-white text-xs px-3.5 py-1.5 rounded-lg font-semibold transition-all disabled:opacity-40"
          >
            {submitting ? "..." : "Submit"}
          </button>

        </div>
      </div>

      {/* SUCCESS BANNER */}
      {submitSuccess && (
        <div className="px-4 py-2.5 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <span>🎉</span>
          <span>Problem marked as solved! Great work!</span>
          <button onClick={() => setSubmitSuccess(false)} className="ml-auto text-emerald-600 hover:text-emerald-400">✕</button>
        </div>
      )}

      {/* EDITOR */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(v) => setCode(v || "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            lineHeight: 22,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
          }}
        />
      </div>

      {/* CONSOLE */}
      <div className="h-[220px] border-t border-white/5 flex flex-col shrink-0">

        {/* TABS */}
        <div className="h-10 border-b border-white/5 flex items-center px-4 gap-5 shrink-0">
          {["output", "ai"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs pb-0.5 transition-all capitalize ${
                activeTab === tab
                  ? "text-white border-b border-white/60"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab === "ai" ? "AI Mentor" : "Output"}
            </button>
          ))}
          {activeTab === "ai" && hintLevel > 1 && (
            <span className="ml-auto text-xs text-slate-600">
              {hintLevel - 1}/3 hints used
            </span>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "output" ? (
            <pre className="text-slate-300 whitespace-pre-wrap text-xs leading-6 font-mono">
              {output || <span className="text-slate-600">Run your code to see output</span>}
            </pre>
          ) : (
            <div className="text-slate-300 whitespace-pre-wrap text-sm leading-7">
              {aiLoading
                ? <span className="text-slate-500 text-xs animate-pulse">AI is thinking...</span>
                : aiHint
                  ? aiHint
                  : <span className="text-slate-600 text-xs">Click 💡 Hint for a nudge · Click Explain for a full walkthrough</span>
              }
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default EditorPanel;