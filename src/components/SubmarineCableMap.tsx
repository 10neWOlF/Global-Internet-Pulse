'use client';

import { useEffect, useState } from 'react';
import { Anchor, MapPin, AlertTriangle, CheckCircle, Clock, Globe, X } from 'lucide-react';

interface SubmarineCable {
  id: string;
  name: string;
  length: number;
  status: 'operational' | 'maintenance' | 'disrupted' | 'planned';
  capacity: string;
  owners: string[];
  landings: string[];
  lastUpdate: Date;
  incidents?: string;
}

// Real submarine cable data (simplified for demo)
const submarineCables: SubmarineCable[] = [
  {
    id: 'sea-me-we-5',
    name: 'SEA-ME-WE 5',
    length: 20000,
    status: 'operational',
    capacity: '24 Tbps',
    owners: ['Orange', 'Bharti Airtel', 'China Telecom'],
    landings: ['France', 'Egypt', 'Saudi Arabia', 'India', 'Singapore'],
    lastUpdate: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 'tata-tgn-atlantic',
    name: 'TATA TGN Atlantic',
    length: 13200,
    status: 'maintenance',
    capacity: '5.12 Tbps',
    owners: ['Tata Communications'],
    landings: ['UK', 'Netherlands', 'USA'],
    lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    incidents: 'Scheduled maintenance on European segment',
  },
  {
    id: 'asia-africa-europe-1',
    name: 'Asia Africa Europe-1 (AAE-1)',
    length: 25000,
    status: 'disrupted',
    capacity: '40 Tbps',
    owners: ['China Unicom', 'Ooredoo', 'Orange'],
    landings: ['Hong Kong', 'Vietnam', 'Pakistan', 'Egypt', 'Greece'],
    lastUpdate: new Date(Date.now() - 45 * 60 * 1000),
    incidents: 'Cable cut detected near Red Sea, rerouting traffic',
  },
  {
    id: 'pacific-crossing-1',
    name: 'Pacific Crossing-1 (PC-1)',
    length: 21000,
    status: 'operational',
    capacity: '10.24 Tbps',
    owners: ['NTT Communications', 'KDDI'],
    landings: ['Japan', 'USA'],
    lastUpdate: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: 'europe-india-gateway',
    name: 'Europe India Gateway (EIG)',
    length: 15000,
    status: 'operational',
    capacity: '3.84 Tbps',
    owners: ['Bharti Airtel', 'British Telecom', 'Vodafone'],
    landings: ['UK', 'Portugal', 'Italy', 'Egypt', 'India'],
    lastUpdate: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: 'trans-pacific-express',
    name: 'Trans-Pacific Express (TPE)',
    length: 17700,
    status: 'planned',
    capacity: '50 Tbps',
    owners: ['Google', 'Facebook', 'Amazon'],
    landings: ['USA', 'Japan', 'South Korea'],
    lastUpdate: new Date(Date.now() - 10 * 60 * 1000),
    incidents: 'New cable deployment in progress',
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'operational': return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'maintenance': return <Clock className="w-4 h-4 text-amber-600" />;
    case 'disrupted': return <AlertTriangle className="w-4 h-4 text-red-600" />;
    case 'planned': return <MapPin className="w-4 h-4 text-blue-600" />;
    default: return <Globe className="w-4 h-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'operational': return 'bg-green-100 text-green-800 border-green-200';
    case 'maintenance': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'disrupted': return 'bg-red-100 text-red-800 border-red-200';
    case 'planned': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function SubmarineCableMap() {
  const [cables, setCables] = useState<SubmarineCable[]>(submarineCables);
  const [selectedCable, setSelectedCable] = useState<SubmarineCable | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Simulate real-time cable status updates
    const interval = setInterval(() => {
      setCables(prev => prev.map(cable => {
        // Randomly update status for some cables
        if (Math.random() < 0.1) { // 10% chance per update
          const statuses: Array<'operational' | 'maintenance' | 'disrupted'> = ['operational', 'maintenance', 'disrupted'];
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          return {
            ...cable,
            status: newStatus,
            lastUpdate: new Date(),
            incidents: newStatus === 'disrupted' ? 'Network anomaly detected, investigating' : 
                      newStatus === 'maintenance' ? 'Routine maintenance in progress' : undefined
          };
        }
        return cable;
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredCables = statusFilter === 'all' 
    ? cables 
    : cables.filter(cable => cable.status === statusFilter);

  const statusCounts = {
    operational: cables.filter(c => c.status === 'operational').length,
    maintenance: cables.filter(c => c.status === 'maintenance').length,
    disrupted: cables.filter(c => c.status === 'disrupted').length,
    planned: cables.filter(c => c.status === 'planned').length,
  };

  if (!mounted) {
    return <div className="animate-pulse bg-white/50 h-96 rounded-xl border border-gray-200"></div>;
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Anchor className="w-5 h-5 text-blue-600" />
            Live Submarine Cable
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Global undersea internet infrastructure monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-blue-600 font-medium">MONITORING</span>
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-gray-300 rounded px-3 py-1 bg-white"
        >
          <option value="all">All Cables ({cables.length})</option>
          <option value="operational">Operational ({statusCounts.operational})</option>
          <option value="maintenance">Maintenance ({statusCounts.maintenance})</option>
          <option value="disrupted">Disrupted ({statusCounts.disrupted})</option>
          <option value="planned">Planned ({statusCounts.planned})</option>
        </select>
      </div>

      {/* Cable List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {filteredCables.map((cable) => (
          <div
            key={cable.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => setSelectedCable(cable)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(cable.status)}
                  <h4 className="font-semibold text-gray-900">{cable.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(cable.status)}`}>
                    {cable.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                  <div>
                    <span className="font-medium">Length:</span> {cable.length.toLocaleString()} km
                  </div>
                  <div>
                    <span className="font-medium">Capacity:</span> {cable.capacity}
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Landings:</span> {cable.landings.join(' → ')}
                </div>
                
                {cable.incidents && (
                  <div className="text-sm text-orange-700 bg-orange-50 px-2 py-1 rounded">
                    ⚠️ {cable.incidents}
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-500 text-right">
                Updated {cable.lastUpdate.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">Global Cable Status</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Operational: {statusCounts.operational}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Maintenance: {statusCounts.maintenance}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Disrupted: {statusCounts.disrupted}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Planned: {statusCounts.planned}</span>
          </div>
        </div>
      </div>

      {/* Cable Detail Modal */}
      {selectedCable && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="modal-card-blue shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Anchor className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedCable.name}</h2>
                    <p className="text-sm text-gray-600">
                      Submarine Internet Cable • {selectedCable.length.toLocaleString()} km
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCable(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Current Status</div>
                  <div className={`text-lg font-semibold flex items-center gap-2 ${
                    selectedCable.status === 'operational' ? 'text-green-600' :
                    selectedCable.status === 'maintenance' ? 'text-amber-600' :
                    selectedCable.status === 'disrupted' ? 'text-red-600' :
                    'text-blue-600'
                  }`}>
                    {getStatusIcon(selectedCable.status)}
                    {selectedCable.status.charAt(0).toUpperCase() + selectedCable.status.slice(1)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Total Capacity</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {selectedCable.capacity}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Cable Route</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedCable.landings.map((landing, index) => (
                      <span key={landing} className="flex items-center gap-1">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {landing}
                        </span>
                        {index < selectedCable.landings.length - 1 && (
                          <span className="text-blue-600">→</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Owners & Operators</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCable.owners.map((owner) => (
                    <span key={owner} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {owner}
                    </span>
                  ))}
                </div>
              </div>

              {selectedCable.incidents && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-orange-900 mb-2">Current Incidents</h4>
                  <p className="text-sm text-orange-800">{selectedCable.incidents}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
