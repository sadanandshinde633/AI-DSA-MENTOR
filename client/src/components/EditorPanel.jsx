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

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

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
      if (selectedProblem) onSaveCode(selectedProblem._id, code, hintLevel);
    } catch {
      setOutput("Error running code.");
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

      if (selectedProblem && response.data.status?.id === 3) {
        await onMarkSolved(selectedProblem._id, code, hintLevel);
        setSubmitSuccess(true);
        // Update streak on solve
        await axios.post(`${API}/api/streak`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      } else if (selectedProblem) {
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
      if (selectedProblem) onSaveCode(selectedProblem._id, code, hintLevel);
    } catch {
      setAiHint("Failed to get hint.");
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
      setAiHint("Failed to explain.");
    } finally {
      setAiLoading(false);
    }
  };

  /* CHAT */
  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: "user", content: chatInput };
    const updated = [...chatMessages, userMsg];
    setChatMessages(updated);
    setChatInput("");
    setChatLoading(true);
    try {
      const response = await axios.post(`${API}/api/chat`, {
        messages: updated,
        problemTitle: selectedProblem?.title || "DSA Problem",
      });
      setChatMessages([...updated, { role: "assistant", content: response.data.reply }]);
    } catch {
      setChatMessages([...updated, { role: "assistant", content: "Sorry, failed to respond." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const resetHints = () => {
    setHintLevel(1);
    setAiHint("");
    setChatMessages([]);
  };

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

        <div className="flex items-center gap-2 shrink-0">
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

          <button
            onClick={getAIHint}
            disabled={aiLoading}
            title={`Level ${hintLevel}/3 — each click gives a bigger hint`}
            className={`border text-xs px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-40 flex items-center gap-1.5 ${currentHint.color}`}
          >
            <span>{currentHint.icon}</span>
            <span>{aiLoading ? "..." : currentHint.label}</span>
          </button>

          {hintLevel > 1 && (
            <button
              onClick={resetHints}
              title="Reset hints"
              className="text-slate-500 hover:text-slate-300 text-sm px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all"
            >
              ↺
            </button>
          )}

          <button
            onClick={explainSolution}
            disabled={aiLoading}
            className="bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/20 text-blue-300 text-xs px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-40"
          >
            Explain
          </button>

          <div className="w-px h-5 bg-white/8" />

          <button
            onClick={runCode}
            disabled={loading}
            className="bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-300 text-xs px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-40"
          >
            {loading ? "Running..." : "▶ Run"}
          </button>

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
          <span>Problem solved! Streak updated!</span>
          <button onClick={() => setSubmitSuccess(false)} className="ml-auto text-emerald-600 hover:text-emerald-400">✕</button>
        </div>
      )}

      {/* EDITOR */}
      <div className="flex-1 overflow-hidden">
        <Editor
          key={selectedProblem?._id + language}
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
      <div className="h-[260px] border-t border-white/5 flex flex-col shrink-0">

        {/* TABS */}
        <div className="h-10 border-b border-white/5 flex items-center px-4 gap-5 shrink-0">
          {["output", "ai", "chat"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs pb-0.5 transition-all capitalize ${
                activeTab === tab
                  ? "text-white border-b border-white/60"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab === "ai" ? "AI Mentor" : tab === "chat" ? "💬 Ask AI" : "Output"}
            </button>
          ))}
          {activeTab === "ai" && hintLevel > 1 && (
            <span className="ml-auto text-xs text-slate-600">
              {hintLevel - 1}/3 hints used
            </span>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-hidden flex flex-col">

          {activeTab === "output" && (
            <div className="flex-1 overflow-y-auto p-4">
              <pre className="text-slate-300 whitespace-pre-wrap text-xs leading-6 font-mono">
                {output || <span className="text-slate-600">Run your code to see output</span>}
              </pre>
            </div>
          )}

          {activeTab === "ai" && (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="text-slate-300 whitespace-pre-wrap text-sm leading-7">
                {aiLoading
                  ? <span className="text-slate-500 text-xs animate-pulse">AI is thinking...</span>
                  : aiHint
                    ? aiHint
                    : <span className="text-slate-600 text-xs">Click 💡 Hint for a nudge · Click Explain for a full walkthrough</span>
                }
              </div>
            </div>
          )}

          {activeTab === "chat" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {chatMessages.length === 0 && (
                  <p className="text-slate-600 text-xs">Ask a follow-up question about this problem...</p>
                )}
                {chatMessages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-5 ${
                      m.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white/8 text-slate-300"
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/8 text-slate-500 text-xs px-3 py-2 rounded-xl animate-pulse">
                      AI is typing...
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="px-3 pb-3 flex gap-2 shrink-0">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  placeholder="Ask a question about this problem..."
                  className="flex-1 px-3 py-1.5 bg-white/5 border border-white/8 rounded-lg text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-blue-500/40 transition-colors"
                />
                <button
                  onClick={sendChat}
                  disabled={chatLoading || !chatInput.trim()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs rounded-lg font-medium transition-all"
                >
                  Send
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default EditorPanel;
