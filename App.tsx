
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/Overview';
import LiveVideo from './components/LiveVideo';
import HardwareStatus from './components/HardwareStatus';
import Logs from './components/Logs';
import Terminal from './components/Terminal';
import AIChat from './components/AIChat';
import DocsModal from './components/DocsModal';
import { ViewType, SensorData, HardwareNode } from './types';
import { X, Save, Sliders, Server, Cpu, Zap, Sparkles, Menu, CheckCircle2 } from 'lucide-react';

const INITIAL_SENSORS: SensorData[] = [
  { id: '1', name: 'Temperature', value: 24.8, unit: '°C', trend: 'up', status: 'success', lastUpdated: 'Just now' },
  { id: '2', name: 'Humidity', value: 48.2, unit: '%', trend: 'down', status: 'success', lastUpdated: 'Just now' },
  { id: '3', name: 'Soil Health', value: 7.2, unit: 'pH', trend: 'stable', status: 'warning', lastUpdated: 'Just now' },
  { id: '4', name: 'Airflow', value: 1.2, unit: 'm/s', trend: 'up', status: 'info', lastUpdated: 'Just now' },
];

const INITIAL_HARDWARE: HardwareNode[] = [
  { id: '1', name: 'Greenhouse Alpha', type: 'ESP32', status: 'online', ip: '192.168.1.45', battery: 85, lastSeen: 'Just now' },
  { id: '2', name: 'Main Gateway', type: 'Gateway', status: 'online', ip: '192.168.1.1', battery: 100, lastSeen: '3s ago' },
  { id: '3', name: 'Irrigation Array', type: 'Arduino', status: 'warning', ip: '192.168.1.48', battery: 12, lastSeen: '5m ago' },
  { id: '4', name: 'West Sector Hub', type: 'ESP32', status: 'offline', ip: '192.168.1.52', battery: 0, lastSeen: '2d ago' },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Global System State
  const [sensors, setSensors] = useState<SensorData[]>(INITIAL_SENSORS);
  const [hardware, setHardware] = useState<HardwareNode[]>(INITIAL_HARDWARE);
  const [controls, setControls] = useState({
    irrigation: false,
    ventilation: true,
    lights: 65,
    fertigation: false,
    autoMode: true,
  });

  const [config, setConfig] = useState({
    apiUrl: 'http://localhost:8000',
    wsUrl: 'ws://localhost:8000/ws',
    aiSensitivity: 85,
    pollingRate: 5,
    debugMode: true,
  });

  // Simulator for sensor changes
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev => prev.map(s => {
        const jitter = (Math.random() - 0.5) * 0.1;
        return { ...s, value: parseFloat((s.value + jitter).toFixed(1)) };
      }));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleOpenSettings = () => setIsSettingsOpen(true);
    const handleOpenAIChat = () => setIsAIChatOpen(true);
    window.addEventListener('open-settings', handleOpenSettings);
    window.addEventListener('open-ai-chat', handleOpenAIChat);
    return () => {
      window.removeEventListener('open-settings', handleOpenSettings);
      window.removeEventListener('open-ai-chat', handleOpenAIChat);
    };
  }, []);

  const toggleControl = useCallback((key: string, value?: any) => {
    setControls(prev => ({ 
      ...prev, 
      [key]: value !== undefined ? value : (typeof (prev as any)[key] === 'boolean' ? !(prev as any)[key] : (prev as any)[key]) 
    }));
  }, []);

  const renderContent = () => {
    const commonProps = { searchQuery, sensors, hardware, setHardware, controls, toggleControl };
    switch (activeView) {
      case 'overview': return <Overview {...commonProps} />;
      case 'video': return <LiveVideo searchQuery={searchQuery} />;
      case 'hardware': return <HardwareStatus {...commonProps} />;
      case 'logs': return <Logs searchQuery={searchQuery} />;
      case 'terminal': return <Terminal />;
      default: return <Overview {...commonProps} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar for Desktop */}
      <div className="hidden lg:block shrink-0">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white animate-in slide-in-from-left duration-300">
            <div className="absolute top-4 right-4 z-10">
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-[#F8FAFC] rounded-xl text-[#64748B]">
                <X size={20} />
              </button>
            </div>
            <Sidebar activeView={activeView} onViewChange={(v) => { setActiveView(v); setIsMobileMenuOpen(false); }} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header 
          onViewChange={setActiveView} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto relative">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
          
          <footer className="mt-20 py-10 border-t border-[#E2E8F0] flex flex-col md:flex-row items-center justify-between text-[#94A3B8] gap-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
              <p className="text-xs font-bold tracking-tight uppercase">System Status: Nominal</p>
            </div>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-[#94A3B8]">
              <button onClick={() => setActiveView('terminal')} className="hover:text-[#10B981] transition-colors">Project Terminal</button>
              <button onClick={() => setIsSettingsOpen(true)} className="hover:text-[#10B981] transition-colors">Configuration</button>
              <button onClick={() => setIsDocsOpen(true)} className="hover:text-[#10B981] transition-colors">Documentation</button>
            </div>
          </footer>
        </main>
      </div>

      {/* Modals & Overlays */}
      <AIChat 
        isOpen={isAIChatOpen} 
        onClose={() => setIsAIChatOpen(false)} 
        systemContext={{ sensors, hardware, controls }}
        onToggleControl={toggleControl}
      />
      
      <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="px-10 py-8 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#10B981] rounded-2xl text-white shadow-lg shadow-[#10B981]/20">
                  <Sliders size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#0F172A]">Core Configuration</h2>
                  <p className="text-[11px] text-[#64748B] font-extrabold uppercase tracking-widest">Global Preferences</p>
                </div>
              </div>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2.5 text-[#94A3B8] hover:bg-[#E2E8F0] hover:text-[#0F172A] rounded-xl transition-all active:scale-90">
                <X size={24} />
              </button>
            </div>

            <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h3 className="text-[11px] font-black text-[#94A3B8] uppercase tracking-[0.2em] flex items-center gap-2">
                    <Server size={14} /> Network Endpoints
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#64748B] uppercase mb-1.5">REST Interface</label>
                      <input type="text" value={config.apiUrl} onChange={(e) => setConfig({...config, apiUrl: e.target.value})} className="w-full px-5 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-sm font-bold focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/5 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#64748B] uppercase mb-1.5">WS Gateway</label>
                      <input type="text" value={config.wsUrl} onChange={(e) => setConfig({...config, wsUrl: e.target.value})} className="w-full px-5 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-sm font-bold focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/5 outline-none transition-all" />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-[11px] font-black text-[#94A3B8] uppercase tracking-[0.2em] flex items-center gap-2">
                    <Zap size={14} /> AI Engine
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Model Sensitivity</label>
                        <span className="text-sm font-black text-[#10B981]">{config.aiSensitivity}%</span>
                      </div>
                      <input type="range" min="50" max="99" value={config.aiSensitivity} onChange={(e) => setConfig({...config, aiSensitivity: parseInt(e.target.value)})} className="w-full h-1.5 bg-[#E2E8F0] rounded-full appearance-none cursor-pointer accent-[#10B981]" />
                    </div>
                    <div className="p-5 bg-[#F0FDF4] rounded-3xl border border-[#DCFCE7] flex items-center gap-4">
                      <div className="p-2.5 bg-white rounded-xl shadow-sm text-[#10B981]">
                        <CheckCircle2 size={20} />
                      </div>
                      <p className="text-xs font-bold text-[#059669]">Cuda Acceleration: ACTIVE</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-10 py-8 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end gap-4">
              <button onClick={() => setIsSettingsOpen(false)} className="px-6 py-3 text-xs font-black uppercase tracking-widest text-[#64748B] hover:text-[#0F172A] transition-colors">Discard</button>
              <button onClick={() => setIsSettingsOpen(false)} className="px-10 py-3.5 bg-[#10B981] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#10B981]/20 hover:bg-[#059669] hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3">
                <Save size={18} /> Commit Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action FAB */}
      <button 
        onClick={() => setIsAIChatOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-[#10B981] text-white rounded-[24px] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-[50] group border-4 border-white"
      >
        <Sparkles size={28} className="group-hover:animate-pulse" />
        <span className="absolute right-[calc(100%+16px)] top-1/2 -translate-y-1/2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#10B981] opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 whitespace-nowrap shadow-xl shadow-black/5">
          Ask Assistant
        </span>
      </button>
    </div>
  );
};

export default App;
