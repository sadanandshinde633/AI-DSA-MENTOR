function ProblemPanel({ selectedProblem, sidebarOpen }) {
  if (!selectedProblem) {
    return (
      <div className={`
        border-r border-white/5 bg-[#0f1117] flex items-center justify-center
        transition-all duration-300 shrink-0
        ${sidebarOpen ? "w-[40%]" : "w-[45%]"}
      `}>
        <div className="text-center px-8">
          <p className="text-3xl mb-3">📋</p>
          <p className="text-slate-500 text-sm">Select a problem to begin</p>
        </div>
      </div>
    );
  }

  const diffColor = selectedProblem.difficulty === "Easy"
    ? "text-emerald-400 bg-emerald-400/8 border-emerald-400/20"
    : selectedProblem.difficulty === "Medium"
    ? "text-amber-400 bg-amber-400/8 border-amber-400/20"
    : "text-red-400 bg-red-400/8 border-red-400/20";

  return (
    <div className={`
      border-r border-white/5 overflow-y-auto bg-[#0f1117]
      transition-all duration-300 shrink-0
      ${sidebarOpen ? "w-[40%]" : "w-[45%]"}
    `}>

      {/* HEADER */}
      <div className="px-7 pt-7 pb-5 border-b border-white/5">
        <h1 className="text-xl font-semibold text-white leading-snug mb-3">
          {selectedProblem.title}
        </h1>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-md border font-medium ${diffColor}`}>
            {selectedProblem.difficulty}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-md border border-white/8 text-slate-400 bg-white/4">
            {selectedProblem.topic}
          </span>
        </div>
      </div>

      {/* BODY */}
      <div className="px-7 py-6 space-y-6">

        {/* DESCRIPTION */}
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Problem</h2>
          <p className="text-slate-300 text-sm leading-7">
            {selectedProblem.description}
          </p>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-white/5" />

        {/* EXAMPLES */}
        {selectedProblem.examples?.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Examples</h2>
            <div className="space-y-2.5">
              {selectedProblem.examples.map((example, index) => (
                <div key={index} className="bg-white/3 border border-white/6 rounded-xl p-4 font-mono text-xs">
                  <p className="text-slate-400">
                    <span className="text-slate-500">Input: </span>
                    <span className="text-slate-300">{example.input}</span>
                  </p>
                  <p className="text-slate-400 mt-1.5">
                    <span className="text-slate-500">Output: </span>
                    <span className="text-slate-300">{example.output}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DIVIDER */}
        {selectedProblem.constraints?.length > 0 && <div className="h-px bg-white/5" />}

        {/* CONSTRAINTS */}
        {selectedProblem.constraints?.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Constraints</h2>
            <ul className="space-y-1.5">
              {selectedProblem.constraints.map((c, i) => (
                <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                  <span className="text-slate-600 mt-1 shrink-0">–</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProblemPanel;