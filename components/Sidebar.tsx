
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { ViewType } from '../types';
import { Terminal, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  return (
    <aside className="w-72 h-screen border-r border-[#E2E8F0] bg-[#FFFFFF] flex flex-col sticky top-0 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#10B981] rounded-xl flex items-center justify-center shadow-lg shadow-[#10B981]/20">
            <Terminal size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#0F172A]">Farm<span className="text-[#10B981]">AI</span></h1>
            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.2em]">Local Build v1.2</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <div className="px-4 mb-4">
          <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Main Menu</p>
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                isActive
                  ? 'bg-[#10B981]/5 text-[#059669] font-bold'
                  : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${isActive ? 'text-[#10B981]' : 'text-[#94A3B8] group-hover:text-[#64748B] transition-colors'}`}>
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
              </div>
              {isActive ? (
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              ) : (
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#94A3B8]" />
              )}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#10B981] rounded-r-full"></div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-[#E2E8F0] relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#10B981]/5 rounded-full blur-2xl group-hover:bg-[#10B981]/10 transition-colors"></div>
          <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-3">System Health</p>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[#0F172A] font-bold">Network Mesh</p>
            <span className="flex items-center gap-1 text-[10px] text-[#16A34A] font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
              Active
            </span>
          </div>
          <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#10B981] h-full w-[85%] rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
          </div>
          <p className="text-[10px] text-[#64748B] mt-3 font-medium flex justify-between">
            <span>8/10 endpoints</span>
            <span>85% Load</span>
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
