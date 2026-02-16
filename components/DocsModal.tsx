
import React from 'react';
import { X, BookOpen, Terminal, Cpu, Info } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="px-8 py-6 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10B981] rounded-xl text-white">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">System Documentation</h2>
              <p className="text-[11px] text-[#64748B] font-medium uppercase tracking-wider">Guide & Specifications</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#94A3B8] hover:bg-[#E2E8F0] hover:text-[#0F172A] rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Cpu size={18} className="text-[#10B981]" /> Hardware Architecture
            </h3>
            <p className="text-sm text-[#64748B] leading-relaxed">
              The system utilizes a distributed sensor network composed of <strong>ESP32</strong> and <strong>Arduino</strong> microcontrollers. Communication is established via a local WebSocket gateway (<code>ws://localhost:8000</code>).
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl">
                <p className="text-xs font-bold text-[#0F172A] mb-1 text-emerald-600">ESP32 Nodes</p>
                <p className="text-[11px] text-[#64748B]">Handles heavy lifting: WiFi, WebSocket streaming, and high-frequency sensor polling.</p>
              </div>
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl">
                <p className="text-xs font-bold text-[#0F172A] mb-1 text-blue-600">Arduino Uno/Mega</p>
                <p className="text-[11px] text-[#64748B]">Manages precision actuators: Irrigation valves, PWM light dimming, and ventilation fans.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Terminal size={18} className="text-[#10B981]" /> Command Center (Terminal)
            </h3>
            <p className="text-sm text-[#64748B] leading-relaxed">
              The Project Terminal provides a raw view of the binary and JSON packets traversing the network. Use it to debug hardware handshakes and monitor AI model inference latency.
            </p>
            <div className="bg-[#0F172A] p-4 rounded-xl font-mono text-[10px] text-[#10B981] space-y-1">
              <p>RECV [0x42]: SENSOR_B_SYNC_SUCCESS</p>
              <p>SEND [0x99]: ACTUATOR_V1_OPEN</p>
              <p className="text-[#94A3B8]">_ cursor blinking...</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Info size={18} className="text-[#10B981]" /> AI Diagnostics
            </h3>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Integrated Gemini AI analyzed multi-modal data (vision + metrics) to provide early warning signatures for common crop pathologies.
            </p>
          </section>
        </div>

        <div className="px-8 py-6 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 bg-[#10B981] text-white rounded-xl text-sm font-bold hover:bg-[#059669] transition-all shadow-lg shadow-[#10B981]/10"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocsModal;
