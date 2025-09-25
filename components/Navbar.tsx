import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { agent, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkStyle = "px-3 py-2 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors";
  const activeLinkStyle = "bg-primary-50 text-primary-600 font-semibold";

  const mobileLinkStyle = "block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-100 hover:text-primary";
  const activeMobileLinkStyle = "bg-primary-50 text-primary";

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
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-primary hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden border-t border-slate-200`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink to="/dashboard" className={({isActive}) => `${mobileLinkStyle} ${isActive ? activeMobileLinkStyle : ''}`} onClick={() => setIsOpen(false)}>
              Dashboard
          </NavLink>
          <NavLink to="/leaderboard" className={({isActive}) => `${mobileLinkStyle} ${isActive ? activeMobileLinkStyle : ''}`} onClick={() => setIsOpen(false)}>
              Leaderboard
          </NavLink>
          <NavLink to="/skill-up" className={({isActive}) => `${mobileLinkStyle} ${isActive ? activeMobileLinkStyle : ''}`} onClick={() => setIsOpen(false)}>
              Skill Up
          </NavLink>
          {agent?.agentEmail === 'auditor@rapido.com' && (
                <NavLink to="/new-audit" className={({isActive}) => `${mobileLinkStyle} ${isActive ? activeMobileLinkStyle : ''}`} onClick={() => setIsOpen(false)}>
                New Audit
            </NavLink>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-slate-200">
          <div className="flex items-center px-5">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary font-bold">
                  {agent?.agentName?.charAt(0)}
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-slate-800">{agent?.agentName}</div>
              <div className="text-sm font-medium text-slate-500">{agent?.agentEmail}</div>
            </div>
          </div>
          <div className="mt-3 px-2 space-y-1">
            <button
              onClick={() => { handleLogout(); setIsOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-100 hover:text-primary"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;