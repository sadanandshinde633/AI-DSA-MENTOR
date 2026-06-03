import { useState } from "react";
import SettingsModal from "./SettingsModal";

function Sidebar({ sidebarOpen, setSidebarOpen, problems, selectedProblem, loadProblem, user, onUpdate, onLogout }) {
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [showSettings, setShowSettings] = useState(false);

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesTopic = selectedTopic === "All" || p.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  const solvedCount = problems.filter((p) => p.solved).length;
  const progressPct = problems.length ? (solvedCount / problems.length) * 100 : 0;
  const avatarLetter = user?.name?.charAt(0).toUpperCase() || "U";

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

        {/* USER PROFILE */}
        <div className={`border-b border-white/5 shrink-0 ${sidebarOpen ? "p-4" : "py-3 flex justify-center"}`}>
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {avatarLetter}
            </div>
            {sidebarOpen && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{user?.name || "User"}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email || ""}</p>
              </div>
            )}
          </div>
        </div>

        {/* PROGRESS */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-b border-white/5 shrink-0">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Progress</span>
              <span className="text-slate-400">{solvedCount}/{problems.length} solved</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* SEARCH + FILTER */}
        {sidebarOpen && (
          <div className="px-3 py-2.5 border-b border-white/5 space-y-2 shrink-0">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-sm text-slate-300 placeholder-slate-600 outline-none focus:border-white/15 transition-colors"
            />
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-sm text-slate-300 outline-none focus:border-white/15 transition-colors"
            >
              <option value="All">All Topics</option>
              <option value="Arrays">Arrays</option>
              <option value="Strings">Strings</option>
              <option value="Linked List">Linked List</option>
              <option value="Stack">Stack</option>
              <option value="Queue">Queue</option>
              <option value="Trees">Trees</option>
              <option value="Graphs">Graphs</option>
              <option value="Binary Search">Binary Search</option>
              <option value="Dynamic Programming">DP</option>
              <option value="Design">Design</option>
            </select>
          </div>
        )}

        {/* PROBLEM LIST */}
        <div className="flex-1 overflow-y-auto py-2">
          {sidebarOpen && (
            <div className="flex justify-between items-center px-4 mb-2">
              <span className="text-xs text-slate-600 uppercase tracking-wider font-medium">Problems</span>
              <span className="text-xs text-slate-600">{filteredProblems.length}</span>
            </div>
          )}

          {filteredProblems.map((problem, index) => {
            const isSelected = selectedProblem?._id === problem._id;
            const diffColor = problem.difficulty === "Easy"
              ? "text-emerald-400"
              : problem.difficulty === "Medium"
              ? "text-amber-400"
              : "text-red-400";

            return (
              <div
                key={problem._id}
                onClick={() => loadProblem(problem._id)}
                className={`
                  mx-2 mb-1 rounded-lg cursor-pointer transition-all duration-150
                  ${isSelected
                    ? "bg-blue-500/10 border border-blue-500/20"
                    : "border border-transparent hover:bg-white/4"
                  }
                `}
              >
                <div className={`flex items-center gap-3 ${sidebarOpen ? "px-3 py-2.5" : "p-3 justify-center"}`}>
                  <span className={`text-xs font-mono shrink-0 w-5 text-center ${isSelected ? "text-blue-400" : "text-slate-600"}`}>
                    {index + 1}
                  </span>
                  {sidebarOpen && (
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isSelected ? "text-white" : "text-slate-300"}`}>
                        {problem.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-xs ${diffColor}`}>{problem.difficulty}</span>
                        <span className="text-slate-700">·</span>
                        <span className="text-xs text-slate-500 truncate">{problem.topic}</span>
                      </div>
                    </div>
                  )}
                  {problem.solved && sidebarOpen && (
                    <span className="text-emerald-400 text-xs shrink-0">✓</span>
                  )}
                </div>
              </div>
            );
          })}

          {filteredProblems.length === 0 && sidebarOpen && (
            <p className="text-slate-600 text-xs text-center mt-6">No problems found</p>
          )}
        </div>

        {/* FOOTER — Settings button */}
        <div className="p-3 border-t border-white/5 shrink-0">
          <button
            onClick={() => setShowSettings(true)}
            className={`w-full rounded-lg py-2 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm flex items-center gap-2 ${sidebarOpen ? "px-3" : "justify-center"}`}
          >
            <span>⚙</span>
            {sidebarOpen && <span>Settings</span>}
          </button>
        </div>

      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          user={user}
          onClose={() => setShowSettings(false)}
          onUpdate={(updatedUser) => {
            onUpdate(updatedUser);
            setShowSettings(false);
          }}
          onLogout={() => {
            setShowSettings(false);
            onLogout();
          }}
        />
      )}
    </>
  );
}

export default Sidebar;