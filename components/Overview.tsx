
import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Added ChevronRight to the import list
import { TrendingUp, TrendingDown, Sparkles, Activity, Droplets, Lightbulb, Wind, Power, Cog, Waves, AlertTriangle, ChevronRight } from 'lucide-react';
import { SensorData, HardwareNode } from '../types';
import { SENSOR_ICONS } from '../constants';
import { getCropInsights } from '../services/geminiService';

const MOCK_CHART_DATA = [
  { time: '08:00', temp: 22, hum: 45 },
  { time: '10:00', temp: 24, hum: 48 },
  { time: '12:00', temp: 28, hum: 42 },
  { time: '14:00', temp: 30, hum: 38 },
  { time: '16:00', temp: 27, hum: 44 },
  { time: '18:00', temp: 23, hum: 50 },
  { time: '20:00', temp: 21, hum: 52 },
];

interface OverviewProps {
  searchQuery?: string;
  sensors: SensorData[];
  hardware: HardwareNode[];
  controls: any;
  toggleControl: (key: any, val?: any) => void;
}

const Overview: React.FC<OverviewProps> = ({ searchQuery = '', sensors, hardware, controls, toggleControl }) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    const fetchInsights = async () => {
      if (!initialLoadDone.current) {
        setIsLoadingInsights(true);
      }
      const res = await getCropInsights(sensors);
      if (res && res.length > 0) {
        setInsights(res);
      }
      setIsLoadingInsights(false);
      initialLoadDone.current = true;
    };
    fetchInsights();
    const interval = setInterval(fetchInsights, 120000); 
    return () => clearInterval(interval);
  }, []);

  const filteredSensors = sensors.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div>
          <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Agricultural Intelligence</h2>
          <p className="text-[#64748B] mt-1 font-medium">Monitoring and optimization Engine for Sector 1.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => toggleControl('autoMode')}
            className={`px-5 py-2.5 rounded-2xl text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-2.5 transition-all shadow-lg active:scale-95 ${
              controls.autoMode 
                ? 'bg-[#10B981] text-white shadow-[#10B981]/20' 
                : 'bg-white border border-[#E2E8F0] text-[#64748B]'
            }`}
          >
            <Cog size={16} className={controls.autoMode ? 'animate-spin' : ''} />
            {controls.autoMode ? 'AI Optimization: ON' : 'Manual Overdrive'}
          </button>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredSensors.map((sensor, idx) => (
          <div 
            key={sensor.id} 
            className="premium-card p-7 group animate-fade-in-up" 
            style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className={`p-3 rounded-2xl transition-colors duration-300 ${
                sensor.status === 'success' ? 'bg-[#F0FDF4] text-[#16A34A] group-hover:bg-[#16A34A] group-hover:text-white' :
                sensor.status === 'warning' ? 'bg-[#FFFBEB] text-[#F59E0B] group-hover:bg-[#F59E0B] group-hover:text-white' :
                'bg-[#EFF6FF] text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white'
              }`}>
                {SENSOR_ICONS[sensor.name as keyof typeof SENSOR_ICONS] || <Activity size={22} />}
              </div>
              <div className={`flex items-center gap-1.5 text-[11px] font-bold ${
                sensor.trend === 'up' ? 'text-[#16A34A]' : 'text-[#DC2626]'
              }`}>
                {sensor.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {sensor.trend === 'up' ? '+2.4%' : '-1.2%'}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-[#94A3B8] uppercase tracking-wider mb-1">{sensor.name}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-[#0F172A]">{sensor.value}</span>
                <span className="text-sm font-bold text-[#94A3B8]">{sensor.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          {/* Chart Section */}
          <div className="bg-white p-8 card-radius border border-[#E2E8F0] soft-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-125 duration-700"></div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-8">Environmental History</h3>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART_DATA}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 600}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                    labelStyle={{ fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="temp" stroke="#10B981" strokeWidth={3} fill="url(#colorTemp)" animationDuration={2000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Control Hub Section */}
          <div className="bg-white p-8 card-radius border border-[#E2E8F0] soft-shadow">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#F0FDF4] text-[#10B981] rounded-xl">
                  <Power size={22} />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">Remote Actuators</h3>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${controls.autoMode ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]' : 'bg-[#FFFBEB] text-[#F59E0B] border border-[#FEF3C7]'}`}>
                {controls.autoMode ? 'System Managed' : 'Manual Override Active'}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {[
                { key: 'irrigation', label: 'Irrigation', icon: <Droplets size={26} /> },
                { key: 'ventilation', label: 'Ventilation', icon: <Wind size={26} /> },
                { key: 'fertigation', label: 'Fertigation', icon: <Waves size={26} /> },
              ].map((ctrl) => (
                <button 
                  key={ctrl.key}
                  onClick={() => toggleControl(ctrl.key)} 
                  className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col items-center gap-4 active:scale-90 group relative ${
                    controls[ctrl.key] 
                      ? 'bg-[#10B981] border-[#10B981] text-white shadow-xl shadow-[#10B981]/20' 
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:border-[#10B981]/40'
                  }`}
                >
                  {ctrl.icon}
                  <p className="text-[10px] font-black uppercase tracking-widest">{ctrl.label}</p>
                  {controls[ctrl.key] && (
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  )}
                </button>
              ))}
              
              <div className="p-6 bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0] flex flex-col items-center gap-3 group transition-colors hover:border-[#10B981]/30">
                <div className="flex justify-between w-full text-[10px] font-black text-[#64748B] uppercase tracking-wider mb-1">
                  <span>Lights</span>
                  <span className="text-[#10B981]">{controls.lights}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={controls.lights} 
                  onChange={(e) => toggleControl('lights', parseInt(e.target.value))} 
                  className="w-full h-1.5 bg-[#E2E8F0] rounded-full appearance-none cursor-pointer accent-[#10B981]" 
                />
                <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Intensity</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Side Panel */}
        <div className="xl:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="bg-white p-8 card-radius border border-[#E2E8F0] soft-shadow sticky top-28 group">
            <div className="absolute -left-1.5 top-12 w-3 h-12 bg-[#10B981] rounded-r-full shadow-lg shadow-[#10B981]/20"></div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-[#F0FDF4] text-[#10B981] rounded-xl group-hover:rotate-12 transition-transform duration-500">
                <Sparkles size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">AI Diagnostics</h3>
                <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest">Powered by Gemini</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {isLoadingInsights ? (
                <div className="space-y-5">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 skeleton rounded-lg w-3/4"></div>
                      <div className="h-3 skeleton rounded-lg w-full"></div>
                    </div>
                  ))}
                </div>
              ) : (
                insights.map((insight, idx) => (
                  <div key={idx} className="flex gap-4 p-5 rounded-3xl bg-[#F8FAFC] border border-transparent hover:border-[#10B981]/20 hover:bg-white transition-all duration-300 group/item">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-[#10B981] shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.4)] group-hover/item:scale-125 transition-transform"></div>
                    <p className="text-sm text-[#059669] leading-relaxed font-semibold">{insight}</p>
                  </div>
                ))
              )}
            </div>

            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))} 
              className="w-full mt-10 py-4 bg-[#0F172A] text-white rounded-2xl text-sm font-extrabold uppercase tracking-widest shadow-xl shadow-[#0F172A]/10 hover:bg-[#1E293B] hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
            >
              Consult Agent <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
