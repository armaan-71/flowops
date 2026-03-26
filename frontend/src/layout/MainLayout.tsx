import type { ReactNode } from 'react';
import './layout.css';
import { Home, FileText, Settings, Bell, Search } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="layout-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar glass-panel">
        <div className="sidebar-header">
          <div className="logo-container">
             <div className="logo-icon"></div>
             <span className="logo-text text-gradient">Cashfeed</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <Home size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item">
            <FileText size={20} />
            <span>Invoices</span>
          </a>
          <a href="#" className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="topbar glass-panel">
          <div className="flex items-center space-x-4 w-full">
            <div className="search-bar w-full max-w-md">
              <Search size={18} className="search-icon text-slate-400" />
              <input type="text" placeholder="Search invoices..." className="search-input" />
            </div>
            <div className="spacer flex-grow"></div>
            <button className="icon-btn">
              <Bell size={20} />
            </button>
            <div className="user-avatar">
              <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="User" />
            </div>
          </div>
        </header>

        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};
