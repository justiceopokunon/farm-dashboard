
import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Settings, Link, Activity, Menu, X } from 'lucide-react';
import { ViewType } from '../types';

interface HeaderProps {
  onViewChange: (view: ViewType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleMobileMenu?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onViewChange, searchQuery, onSearchChange, onToggleMobileMenu }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Early Blight Detected', time: '2m ago', read: false, type: 'alert' },
    { id: 2, title: 'Node-03 Battery Low', time: '15m ago', read: false, type: 'warning' },
    { id: 3, title: 'System Backup Complete', time: '1h ago', read: true, type: 'info' },
  ]);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));
  const clearNotifications = () => setNotifications([]);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-20 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button 
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2.5 text-[#64748B] hover:bg-[#F8FAFC] rounded-xl transition-colors active:scale-95"
        >
          <Menu size={24} />
        </button>
        <div className="relative w-full group hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#10B981] transition-colors" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Quick search nodes or logs..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-sm outline-none focus:ring-4 focus:ring-[#10B981]/5 focus:border-[#10B981] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {/* Status Chip Desktop */}
        <div className="hidden xl:flex items-center gap-4 border-r border-[#E2E8F0] pr-5">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Local Host</span>
            <span className="text-xs font-mono font-bold text-[#10B981]">agro-mesh.local</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#F0FDF4] border border-[#DCFCE7] rounded-full shadow-sm shadow-[#10B981]/5">
            <Activity size={12} className="text-[#16A34A] animate-pulse" />
            <span className="text-[10px] font-extrabold text-[#16A34A] uppercase tracking-widest">Live</span>
          </div>
        </div>

        <div className="flex items-center gap-1 relative" ref={notificationRef}>
          {/* Notifications */}
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`p-2.5 rounded-xl transition-all relative active:scale-90 ${isNotificationsOpen ? 'bg-[#F0FDF4] text-[#10B981]' : 'text-[#64748B] hover:bg-[#F8FAFC]'}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#DC2626] border-2 border-white rounded-full"></span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-[#E2E8F0] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300 z-50">
              <div className="p-5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0F172A]">System Notifications</h3>
                <div className="flex gap-3">
                  <button onClick={markAllAsRead} className="text-[10px] font-bold text-[#10B981] uppercase hover:underline">Read All</button>
                  <button onClick={clearNotifications} className="text-[10px] font-bold text-[#64748B] uppercase hover:underline">Clear</button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto p-2 space-y-1">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-xs text-[#94A3B8] font-medium italic">All caught up!</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-4 rounded-2xl hover:bg-[#F8FAFC] transition-colors cursor-pointer group relative">
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${n.type === 'alert' ? 'text-[#DC2626]' : n.type === 'warning' ? 'text-[#F59E0B]' : 'text-[#10B981]'}`}>{n.type}</span>
                        <span className="text-[10px] text-[#94A3B8] font-medium">{n.time}</span>
                      </div>
                      <p className={`text-xs ${n.read ? 'text-[#64748B]' : 'text-[#0F172A] font-bold'}`}>{n.title}</p>
                      {!n.read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#10B981] rounded-full"></div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Settings Button */}
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-settings'))}
            className="p-2.5 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#10B981] rounded-xl transition-all active:scale-90"
          >
            <Settings size={20} />
          </button>
          
          <div className="hidden sm:block h-8 w-px bg-[#E2E8F0] mx-2"></div>
          
          {/* Terminal Quick Link */}
          <button 
            onClick={() => onViewChange('terminal')}
            className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-[#F8FAFC] group transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] group-hover:bg-[#10B981] group-hover:text-white flex items-center justify-center text-[#64748B] transition-all duration-300">
              <Link size={16} />
            </div>
            <span className="text-xs font-bold text-[#0F172A]">Terminal</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
