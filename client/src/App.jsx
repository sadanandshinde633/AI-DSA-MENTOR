import { useState } from "react";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  });

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleUpdate = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  if (!user) return <AuthPage onLogin={handleLogin} />;

  return (
    <Home
      user={user}
      onUpdate={handleUpdate}
      onLogout={handleLogout}
    />
  );
}

export default App;