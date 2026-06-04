import { useState } from "react";
import SettingsModal from "./SettingsModal";

function Sidebar({ sidebarOpen, setSidebarOpen, problems, selectedProblem, loadProblem, user, onUpdate, onLogout }) {
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [showSettings, setShowSettings] = useState(false);

  const problems_ = problems || [];
  const topics = ["All", ...Array.from(new Set(problems_.map((p) => p.topic)))];
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const filteredProblems = problems_.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesTopic = selectedTopic === "All" || p.topic === selectedTopic;
    const matchesDiff = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
    return matchesSearch && matchesTopic && matchesDiff;
  });

  const solvedCount = problems_.filter((p) => p.solved).length;
  const progressPct = problems_.length ? (solvedCount / problems_.length) * 100 : 0;
  const avatarLetter = user?.name?.charAt(0).toUpperCase() || "U";

  const diffColor = (d) =>
    d === "Easy" ? "text-emerald-400" : d === "Medium" ? "text-amber-400" : "text-red-400";

  return (
    <>
      <div className={`
        flex flex-col bg-[#0f1117] border-r border-white/5
        transition-all duration-300 overflow-hidden shrink-0
        ${sidebarOpen ? "w-[280px]" : "w-[60px]"}
      `}>

        {/* LOGO ROW */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
              <span className="text-blue-400 text-sm">⚡</span>
            </div>
            {sidebarOpen && (
              <span className="text-sm font-semibold text-white truncate">AI Mentor</span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-500 hover:text-slate-300 transition-colors shrink-0 text-base"
          >
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        {sidebarOpen && (
          <>
            {/* PROGRESS BAR */}
            <div className="px-4 py-3 border-b border-white/5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-500">Progress</span>
                <span className="text-xs text-slate-400 font-medium">{solvedCount}/{problems_.length}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-xs text-slate-600 mt-1">{Math.round(progressPct)}% complete</p>
            </div>

            {/* SEARCH */}
            <div className="px-3 pt-3 pb-2">
              <input
                type="text"
                placeholder="Search problems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/8 rounded-lg text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-white/15 transition-colors"
              />
            </div>

            {/* DIFFICULTY FILTER */}
            <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    selectedDifficulty === d
                      ? "bg-white/10 border-white/20 text-white"
                      : "border-white/5 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* TOPIC FILTER */}
            <div className="px-3 pb-2 overflow-x-auto">
              <div className="flex gap-1.5">
                {topics.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTopic(t)}
                    className={`text-xs px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all ${
                      selectedTopic === t
                        ? "bg-blue-500/20 border-blue-500/30 text-blue-300"
                        : "border-white/5 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* PROBLEM COUNT */}
            <div className="px-4 py-1.5">
              <span className="text-xs text-slate-600">{filteredProblems.length} problems</span>
            </div>
          </>
        )}

        {/* PROBLEM LIST */}
        <div className="flex-1 overflow-y-auto">
          {filteredProblems.map((p) => {
            const isActive = selectedProblem?._id === p._id;
            return (
              <button
                key={p._id}
                onClick={() => loadProblem(p._id)}
                className={`w-full text-left transition-all ${
                  isActive ? "bg-white/8" : "hover:bg-white/4"
                } ${sidebarOpen ? "px-4 py-3" : "px-0 py-3 flex items-center justify-center"}`}
              >
                {sidebarOpen ? (
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs ${
                      p.solved
                        ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                        : "bg-white/5 border border-white/10 text-slate-600"
                    }`}>
                      {p.solved ? "✓" : ""}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-medium truncate ${isActive ? "text-white" : "text-slate-300"}`}>
                        {p.title}
                      </p>
                      <p className={`text-xs mt-0.5 ${diffColor(p.difficulty)}`}>{p.difficulty}</p>
                    </div>
                  </div>
                ) : (
                  <div className={`w-2 h-2 rounded-full ${p.solved ? "bg-emerald-500" : isActive ? "bg-blue-400" : "bg-white/20"}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* USER ROW */}
        <div className="border-t border-white/5 shrink-0">
          <button
            onClick={() => setShowSettings(true)}
            className={`w-full flex items-center transition-colors hover:bg-white/4 ${sidebarOpen ? "gap-3 px-4 py-3.5" : "justify-center px-0 py-3.5"}`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {avatarLetter}
            </div>
            {sidebarOpen && (
              <div className="min-w-0 text-left flex-1">
                <p className="text-xs font-medium text-white truncate">{user?.name || "User"}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email || ""}</p>
              </div>
            )}
          </button>
        </div>

      </div>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <SettingsModal
          user={user}
          onClose={() => setShowSettings(false)}
          onUpdate={onUpdate}
          onLogout={onLogout}
        />
      )}
    </>
  );
}

export default Sidebar;