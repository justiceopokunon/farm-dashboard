
import React, { useState } from 'react';
import { Maximize2, ShieldCheck, AlertCircle, Camera, Search, RefreshCw } from 'lucide-react';

const MOCK_DETECTIONS = [
  { id: '1', type: 'Early Blight', confidence: 0.94, time: '2m ago', zone: 'Greenhouse Alpha' },
  { id: '2', type: 'Powdery Mildew', confidence: 0.88, time: '15m ago', zone: 'Hydroponic Lab' },
  { id: '3', type: 'Leaf Rust', confidence: 0.97, time: '1h ago', zone: 'West Orchard Node' },
];

interface LiveVideoProps {
  searchQuery?: string;
}

const LiveVideo: React.FC<LiveVideoProps> = ({ searchQuery = '' }) => {
  const [isLive, setIsLive] = useState(true);

  const filteredDetections = MOCK_DETECTIONS.filter(d => 
    d.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.zone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">AI Vision Analytics</h2>
          <p className="text-[#64748B] mt-1">Real-time disease detection stream via TensorFlow Edge.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-[#22C55E] animate-pulse' : 'bg-[#94A3B8]'}`}></div>
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">
              {isLive ? 'Stream Active' : 'Offline'}
            </span>
          </div>
          <button className="p-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC]">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-6">
          {/* Main Video Window */}
          <div className="relative aspect-video bg-[#0F172A] rounded-2xl overflow-hidden soft-shadow border border-[#E2E8F0]">
            <img 
              src="https://images.unsplash.com/photo-1592323985531-319eb5084111?auto=format&fit=crop&q=80&w=1200&h=800" 
              alt="Live Feed" 
              className="w-full h-full object-cover opacity-80"
            />
            
            {/* AI Overlay Layer */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[300px] h-[300px] border-2 border-[#F59E0B] rounded-lg flex items-center justify-center">
                <div className="absolute -top-10 left-0 bg-[#F59E0B] text-white px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                  <Search size={12} />
                  Detecting: Early Blight (94%)
                </div>
                {/* Scanner line effect */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-[#F59E0B] animate-scan opacity-50 shadow-[0_0_15px_rgba(245,158,11,0.8)]"></div>
              </div>
            </div>

            {/* Video Controls Overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="px-4 py-2 bg-black/40 backdrop-blur-md border border-white/20 rounded-xl text-white text-xs font-medium flex items-center gap-2">
                  <Camera size={14} />
                  CAM_NORTH_01
                </div>
                <div className="px-4 py-2 bg-black/40 backdrop-blur-md border border-white/20 rounded-xl text-white text-xs font-medium">
                  192.168.1.104
                </div>
              </div>
              <button className="p-2.5 bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-black/60 transition-colors">
                <Maximize2 size={20} />
              </button>
            </div>
          </div>

          {/* Camera Info Bar */}
          <div className="flex items-center gap-6 p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
            <div className="flex-1 flex items-center gap-4">
              <ShieldCheck className="text-[#22C55E]" size={24} />
              <div>
                <p className="text-sm font-bold text-[#0F172A]">AI System Integrity Nominal</p>
                <p className="text-xs text-[#64748B]">Latency: 42ms | FPS: 30.2 | Model: Agro-V3-Fast</p>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-white border border-[#E2E8F0] text-[#0F172A] rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all">
              Configure Thresholds
            </button>
          </div>
        </div>

        {/* Activity Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 card-radius border border-[#E2E8F0] soft-shadow h-full">
            <h3 className="text-lg font-bold text-[#0F172A] mb-6 flex items-center gap-2">
              <AlertCircle size={20} className="text-[#10B981]" />
              Recent Alerts
            </h3>
            
            <div className="space-y-4">
              {filteredDetections.length > 0 ? (
                filteredDetections.map((det) => (
                  <div key={det.id} className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#10B981]/30 bg-[#F8FAFC] transition-all cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider">{det.type}</span>
                      <span className="text-[10px] text-[#94A3B8]">{det.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#0F172A]">{det.zone}</p>
                      <p className="text-xs font-bold text-[#10B981] group-hover:underline">View Snapshot</p>
                    </div>
                    <div className="mt-3 w-full bg-[#E2E8F0] h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#22C55E] h-full transition-all" 
                        style={{ width: `${det.confidence * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-[#94A3B8] mt-1.5 font-medium">Confidence: {(det.confidence * 100).toFixed(1)}%</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-[#64748B] text-xs">No alerts matching "{searchQuery}"</p>
                </div>
              )}
            </div>

            <div className="mt-8">
              <button className="w-full py-3 border-2 border-dashed border-[#E2E8F0] text-[#64748B] text-sm font-medium rounded-xl hover:border-[#10B981] hover:text-[#10B981] transition-all">
                Download Alert History
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LiveVideo;
