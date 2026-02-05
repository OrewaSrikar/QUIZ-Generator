import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Generator } from './pages/Generator';
import { History } from './pages/History';
import { LayoutDashboard, History as HistoryIcon } from 'lucide-react';

const NavLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isActive
          ? "bg-white text-indigo-600 shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
    >
      <Icon className="w-4 h-4" />
      {children}
    </Link>
  );
};

// Component wrapper to use useLocation
const Navigation = () => (
  <nav className="flex items-center gap-2 p-1 bg-slate-100/80 backdrop-blur rounded-xl border border-slate-200">
    <NavLink to="/" icon={LayoutDashboard}>Generator</NavLink>
    <NavLink to="/history" icon={HistoryIcon}>History</NavLink>
  </nav>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-white">

        {/* Navbar */}
        <header className="fixed top-0 left-0 right-0 z-30 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-inner"></div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
                DeepKlarity Quiz
              </span>
            </div>
            <Navigation />
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-28 pb-12 px-6">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Generator />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </div>
        </main>

      </div>
    </Router>
  );
}

export default App;
