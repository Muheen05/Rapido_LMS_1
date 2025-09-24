import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { agent, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkStyle = "px-3 py-2 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors";
  const activeLinkStyle = "bg-primary-50 text-primary-600 font-semibold";

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-slate-200">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
                <span className="text-primary font-bold text-2xl tracking-tight">Rapido LMS</span>
            </div>
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2">
                <NavLink to="/dashboard" className={({isActive}) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>
                    Dashboard
                </NavLink>
                <NavLink to="/leaderboard" className={({isActive}) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>
                    Leaderboard
                </NavLink>
                 <NavLink to="/skill-up" className={({isActive}) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>
                    Skill Up
                </NavLink>
                {agent?.agentEmail === 'auditor@rapido.com' && (
                     <NavLink to="/new-audit" className={({isActive}) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>
                        New Audit
                    </NavLink>
                )}
              </div>
            </nav>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
                <span className="text-slate-500 mr-4 text-sm">Welcome, {agent?.agentName}</span>
              <button
                onClick={handleLogout}
                className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;