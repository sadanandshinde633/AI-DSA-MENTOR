import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import ProblemPanel from "../components/ProblemPanel";
import EditorPanel from "../components/EditorPanel";

const API = import.meta.env.VITE_API_URL || "";

const starterCodes = {
  javascript: `function solve() {\n\n}\n\nsolve();`,
  python: `def solve():\n    pass\n\nsolve()`,
  java: `import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n\n    }\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n\n    return 0;\n}`,
};

function Home({ user, onUpdate, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(starterCodes.python);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({}); // { problemId: { solved, code, hintLevel } }

  useEffect(() => { fetchProblems(); }, []);

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const [problemsRes, progressRes] = await Promise.all([
        axios.get(`${API}/api/problems`),
        axios.get(`${API}/api/progress`, getAuthHeader()),
      ]);

      const problemsList = problemsRes.data;

      // Build progress map { problemId: { solved, code, hintLevel } }
      const progressMap = {};
      progressRes.data.forEach((p) => {
        progressMap[p.problemId] = { solved: p.solved, code: p.code, hintLevel: p.hintLevel };
      });

      // Merge solved status into problems
      const merged = problemsList.map((p) => ({
        ...p,
        solved: progressMap[p._id]?.solved || false,
      }));

      setProblems(merged);
      setProgress(progressMap);

      if (merged.length > 0) {
        setSelectedProblem(merged[0]);
        const savedCode = progressMap[merged[0]._id]?.code;
        setCode(savedCode || merged[0]?.starterCode || starterCodes.python);
      }
    } catch (error) {
      console.log("Failed to fetch problems:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadProblem = async (id) => {
    try {
      const res = await axios.get(`${API}/api/problem/${id}`);
      setSelectedProblem(res.data);
      setLanguage("python");
      // Load saved code if exists, else use starter code
      const savedCode = progress[id]?.code;
      setCode(savedCode || res.data?.starterCode || starterCodes.python);
    } catch (error) {
      console.log("Failed to load problem:", error);
    }
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setCode(starterCodes[lang] || starterCodes.python);
  };

  const markSolved = async (problemId, currentCode, hintLevel) => {
    try {
      await axios.post(`${API}/api/progress/save`, {
        problemId,
        solved: true,
        code: currentCode,
        hintLevel,
      }, getAuthHeader());

      // Update local state so sidebar shows green tick immediately
      setProgress((prev) => ({
        ...prev,
        [problemId]: { solved: true, code: currentCode, hintLevel },
      }));
      setProblems((prev) =>
        prev.map((p) => p._id === problemId ? { ...p, solved: true } : p)
      );
    } catch (error) {
      console.log("Failed to save progress:", error);
    }
  };

  const saveCode = async (problemId, currentCode, hintLevel) => {
    try {
      await axios.post(`${API}/api/progress/save`, {
        problemId,
        solved: progress[problemId]?.solved || false,
        code: currentCode,
        hintLevel,
      }, getAuthHeader());
    } catch (error) {
      console.log("Failed to save code:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#0d1117] items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">⚡</div>
          <p className="text-slate-500 text-sm">Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0d1117] text-white overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        problems={problems}
        selectedProblem={selectedProblem}
        loadProblem={loadProblem}
        user={user}
        onUpdate={onUpdate}
        onLogout={onLogout}
      />
      <div className="flex flex-1 overflow-hidden min-w-0">
        <ProblemPanel
          selectedProblem={selectedProblem}
          sidebarOpen={sidebarOpen}
        />
        <EditorPanel
          language={language}
          changeLanguage={changeLanguage}
          code={code}
          setCode={setCode}
          selectedProblem={selectedProblem}
          onMarkSolved={markSolved}
          onSaveCode={saveCode}
          progress={progress}
        />
      </div>
    </div>
  );
}

export default Home;