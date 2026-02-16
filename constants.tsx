
import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  Cpu, 
  FileText, 
  Bell, 
  Settings, 
  Search,
  Thermometer,
  Droplets,
  Wind,
  Sprout,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info as InfoIcon,
  Terminal as TerminalIcon
} from 'lucide-react';

export const COLORS = {
  primary: '#10B981', // Emerald
  secondary: '#0D9488', // Teal
  accent: '#22C55E', // Green
  background: '#F8FAFC',
  card: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  success: '#16A34A',
  warning: '#F59E0B',
  error: '#DC2626',
  info: '#2563EB',
};

export const NAV_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'video', label: 'Live Detection', icon: <Video size={20} /> },
  { id: 'hardware', label: 'Hardware Fleet', icon: <Cpu size={20} /> },
  { id: 'logs', label: 'System Logs', icon: <FileText size={20} /> },
  { id: 'terminal', label: 'Project Terminal', icon: <TerminalIcon size={20} /> },
];

export const STATUS_ICONS = {
  success: <CheckCircle2 size={16} className="text-[#16A34A]" />,
  warning: <AlertTriangle size={16} className="text-[#F59E0B]" />,
  error: <XCircle size={16} className="text-[#DC2626]" />,
  info: <InfoIcon size={16} className="text-[#2563EB]" />,
};

export const SENSOR_ICONS = {
  Temperature: <Thermometer size={20} />,
  Humidity: <Droplets size={20} />,
  Airflow: <Wind size={20} />,
  'Soil Health': <Sprout size={20} />,
};
