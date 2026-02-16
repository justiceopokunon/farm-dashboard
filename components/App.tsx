
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/Overview';
import LiveVideo from './components/LiveVideo';
import HardwareStatus from './components/HardwareStatus';
import Logs from './components/Logs';
import Terminal from './components/Terminal';
import AIChat from './components/AIChat';
import DocsModal from './components/DocsModal';
import { ViewType } from './types';
// Added missing Sparkles icon to the import list
import { X, Save, Sliders, Server, Cpu, Zap, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [config, setConfig] = useState({
    apiUrl: 'http://localhost:8000',
    wsUrl: 'ws://localhost:8000/ws',
    aiSensitivity: 85,
    pollingRate: 5,
    debugMode: true,
  });

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

  const renderContent = () => {
    switch (activeView) {
      case 'overview': return <Overview />;
      case 'video': return <LiveVideo />;
      case 'hardware': return <HardwareStatus />;
      case 'logs': return <Logs />;
      case 'terminal': return <Terminal />;
      default: return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeView={activeView} 
        onViewChange={(view) => setActiveView(view)} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header onViewChange={(view) => setActiveView(view)} />

        {/* Dynamic Main Content */}
        <main className="flex-1 p-8 overflow-y-auto relative">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
          
          {/* Subtle footer */}
          <footer className="mt-12 pt-8 border-t border-[#E2E8F0] flex items-center justify-between text-[#94A3B8]">
            <p className="text-xs">© 2024 Farm Monitoring System. Localhost Instance.</p>
            <div className="flex gap-6 text-xs font-medium uppercase tracking-widest">
              <button onClick={() => setActiveView('terminal')} className="hover:text-[#10B981] transition-colors">Debug</button>
              <button onClick={() => setIsSettingsOpen(true)} className="hover:text-[#10B981] transition-colors">Settings</button>
              <button onClick={() => setIsDocsOpen(true)} className="hover:text-[#10B981] transition-colors">Docs</button>
            </div>
          </footer>
        </main>
      </div>

      {/* Overlays & Modals */}
      <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
      <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#10B981] rounded-xl text-white">
                  <Sliders size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0F172A]">System Configuration</h2>
                  <p className="text-[11px] text-[#64748B] font-medium uppercase tracking-wider">Local Environment v1.0</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="p-2 text-[#94A3B8] hover:bg-[#E2E8F0] hover:text-[#0F172A] rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                {/* Connection Settings */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest flex items-center gap-2">
                    <Server size={14} /> Backend Services
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#64748B] mb-1">REST API Endpoint</label>
                      <input 
                        type="text" 
                        value={config.apiUrl}
                        onChange={(e) => setConfig({...config, apiUrl: e.target.value})}
                        className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-mono focus:border-[#10B981] outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#64748B] mb-1">WebSocket Gateway</label>
                      <input 
                        type="text" 
                        value={config.wsUrl}
                        onChange={(e) => setConfig({...config, wsUrl: e.target.value})}
                        className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-mono focus:border-[#10B981] outline-none" 
                      />
                    </div>
                  </div>
                </div>

                {/* Performance Settings */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest flex items-center gap-2">
                    <Zap size={14} /> AI & Processing
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[11px] font-bold text-[#64748B]">Detection Sensitivity</label>
                        <span className="text-xs font-bold text-[#10B981]">{config.aiSensitivity}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="50" max="99" 
                        value={config.aiSensitivity}
                        onChange={(e) => setConfig({...config, aiSensitivity: parseInt(e.target.value)})}
                        className="w-full h-1.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#10B981]" 
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
                      <div>
                        <p className="text-[11px] font-bold text-[#0F172A]">Debug Overlays</p>
                        <p className="text-[10px] text-[#64748B]">Show AI bounding boxes</p>
                      </div>
                      <button 
                        onClick={() => setConfig({...config, debugMode: !config.debugMode})}
                        className={`w-10 h-5 rounded-full relative transition-colors ${config.debugMode ? 'bg-[#10B981]' : 'bg-[#CBD5E1]'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.debugMode ? 'left-6' : 'left-1'}`}></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Cpu size={18} className="text-[#10B981]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#059669]">Hardware Acceleration Active</p>
                  <p className="text-[10px] text-[#059669] opacity-80">Local TensorFlow instance using CUDA/Edge cores.</p>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end gap-3">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="px-6 py-2 text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // Simulate save
                  setIsSettingsOpen(false);
                }}
                className="px-8 py-2.5 bg-[#10B981] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#10B981]/20 hover:bg-[#059669] transition-all flex items-center gap-2"
              >
                <Save size={16} />
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button for AI Chat */}
      <button 
        onClick={() => setIsAIChatOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#10B981] text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group"
      >
        <Sparkles size={24} className="group-hover:animate-pulse" />
        <span className="absolute right-full mr-4 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-bold text-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
          AI Assistant
        </span>
      </button>

      {/* Persistent Status Bar for Mobile/Tablet */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-lg border border-[#E2E8F0] px-6 py-3 rounded-2xl soft-shadow flex items-center gap-8 z-50">
         <p className="text-xs font-bold text-[#10B981]">System Preview</p>
      </div>
    </div>
  );
};

export default App;
