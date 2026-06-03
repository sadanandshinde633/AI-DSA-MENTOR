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

  useEffect(() => { fetchProblems(); }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/problems`);
      setProblems(res.data);
      if (res.data.length > 0) {
        setSelectedProblem(res.data[0]);
        setCode(res.data[0]?.starterCode || starterCodes.python);
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
      setCode(res.data?.starterCode || starterCodes.python);
    } catch (error) {
      console.log("Failed to load problem:", error);
    }
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setCode(starterCodes[lang] || starterCodes.python);
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
        />
      </div>
    </div>
  );
}

export default Home;