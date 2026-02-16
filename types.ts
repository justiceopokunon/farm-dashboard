
export type ViewType = 'overview' | 'video' | 'hardware' | 'logs' | 'terminal';

export interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'success' | 'warning' | 'error' | 'info';
  lastUpdated: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface HardwareNode {
  id: string;
  name: string;
  type: 'Arduino' | 'ESP32' | 'Gateway';
  status: 'online' | 'warning' | 'offline';
  ip: string;
  battery: number;
  lastSeen: string;
}

export interface Detection {
  id: string;
  type: string;
  confidence: number;
  timestamp: string;
  image?: string;
  location: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  source: string;
}
