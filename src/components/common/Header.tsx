import { useNavigate, Link } from 'react-router';
import { useState } from 'react';
import Back from './Back';
import Menu from './Menu';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const navigate = useNavigate();
  const { user, authMode, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLocalMenu, setShowLocalMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <>
      <header className="border-b border-border-main bg-bg-primary backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition bg-transparent">
              <img src="/logo.svg" className="min-h-[48px]" />
            </Link>
            
            <div className="flex items-center gap-4">
              <Menu isMobile={false} />
              
              {/* User Profile / Auth Status */}
              {authMode === 'firebase' && user ? (
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-secondary hover:bg-opacity-80 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {user.displayName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm text-text-primary hidden lg:inline">
                      {user.displayName || user.email}
                    </span>
                  </button>
                  
                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute right-0 mt-2 w-64 bg-bg-secondary rounded-lg shadow-lg border border-border-main z-50">
                        <div className="p-4 border-b border-border-main">
                          <p className="text-sm font-semibold text-text-primary">{user.displayName || 'User'}</p>
                          <p className="text-xs text-text-secondary truncate">{user.email}</p>
                          <p className="text-xs text-secondary-main mt-1">☁️ Cloud Sync Enabled</p>
                        </div>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-3 text-sm text-text-primary hover:bg-bg-primary transition flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : authMode === 'local' && (
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setShowLocalMenu(!showLocalMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-secondary hover:bg-opacity-80 transition"
                  >
                    <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-text-primary">Local Mode</span>
                  </button>
                  
                  {showLocalMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowLocalMenu(false)} />
                      <div className="absolute right-0 mt-2 w-64 bg-bg-secondary rounded-lg shadow-lg border border-border-main z-50">
                        <div className="p-4 border-b border-border-main">
                          <p className="text-sm font-semibold text-text-primary">Local Mode</p>
                          <p className="text-xs text-text-secondary">Data stored on this device only</p>
                        </div>
                        <button
                          onClick={() => {
                            setShowLocalMenu(false);
                            navigate('/auth');
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-text-primary hover:bg-bg-primary transition flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Go Online
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Hamburger Menu Button - Mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden flex flex-col gap-1 p-2 rounded-lg transition ${isMenuOpen ? 'bg-bg-secondary' : 'bg-transparent'
                }`}
            >
              <span
                className="w-6 h-0.5 transition-all bg-text-primary"
                style={{
                  transform: isMenuOpen ? 'rotate(45deg) translateY(8px)' : 'rotate(0)',
                }}
              />
              <span
                className="w-6 h-0.5 transition-all bg-text-primary"
                style={{
                  opacity: isMenuOpen ? '0' : '1',
                }}
              />
              <span
                className="w-6 h-0.5 transition-all bg-text-primary"
                style={{
                  transform: isMenuOpen ? 'rotate(-45deg) translateY(-8px)' : 'rotate(0)',
                }}
              />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <Menu isMobile={true} />
          )}
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 pt-2">
        <Back navigate={navigate} />
      </div>
    </>
  );
}
