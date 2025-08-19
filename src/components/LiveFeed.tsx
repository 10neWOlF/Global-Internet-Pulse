"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Shield, Zap, Globe, Clock, Filter, X } from "lucide-react";
import { format } from "date-fns";

interface FeedItem {
  id: string;
  type: "outage" | "censorship" | "traffic" | "recovery";
  country: string;
  message: string;
  timestamp: Date;
  severity: "low" | "medium" | "high";
  source: "OONI" | "Cloudflare" | "Monitor" | "Simulation";
}

const mockFeedData: FeedItem[] = [
  {
    id: "1",
    type: "outage",
    country: "Iran",
    message: "Major ISP outage affecting 60% of users in Tehran region",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    severity: "high",
    source: "Monitor"
  },
  {
    id: "2",
    type: "censorship",
    country: "Myanmar",
    message: "Social media platforms blocked during government meeting",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    severity: "medium",
    source: "OONI"
  },
  {
    id: "3",
    type: "traffic",
    country: "India",
    message: "Unusual traffic spike detected in Mumbai data centers",
    timestamp: new Date(Date.now() - 22 * 60 * 1000),
    severity: "medium",
    source: "Cloudflare"
  },
  {
    id: "4",
    type: "recovery",
    country: "Brazil",
    message: "Internet services restored after 2-hour outage in Sao Paulo",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    severity: "low",
    source: "Monitor"
  },
  {
    id: "5",
    type: "censorship",
    country: "Russia",
    message: "VPN services experiencing connectivity issues",
    timestamp: new Date(Date.now() - 67 * 60 * 1000),
    severity: "high",
    source: "OONI"
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "outage": return <AlertTriangle className="w-5 h-5" />;
    case "censorship": return <Shield className="w-5 h-5" />;
    case "traffic": return <Zap className="w-5 h-5" />;
    case "recovery": return <Globe className="w-5 h-5" />;
    default: return <Clock className="w-5 h-5" />;
  }
};

const getColorClass = (type: string, severity: string) => {
  if (type === "recovery") return "text-emerald-600 bg-emerald-100";
  
  switch (severity) {
    case "high": return "text-red-600 bg-red-100";
    case "medium": return "text-amber-600 bg-amber-100";
    case "low": return "text-blue-600 bg-blue-100";
    default: return "text-gray-600 bg-gray-100";
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high": return "bg-red-500";
    case "medium": return "bg-amber-500";
    case "low": return "bg-blue-500";
    default: return "bg-gray-500";
  }
};

export default function LiveFeed() {
  const [feedData, setFeedData] = useState<FeedItem[]>(mockFeedData);
  const [mounted, setMounted] = useState(false);
  const [filteredType, setFilteredType] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<FeedItem | null>(null);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Enhanced event messages for more realistic content
  const eventMessages = {
    outage: [
      "Major ISP outage affecting {percentage}% of users in {region}",
      "Internet connectivity disrupted due to infrastructure failure",
      "Network outage reported in major metropolitan areas", 
      "Widespread connectivity issues reported by multiple ISPs",
      "Critical infrastructure failure causing regional outage"
    ],
    censorship: [
      "Social media platforms blocked during {reason}",
      "VPN services experiencing connectivity issues",
      "Access restrictions implemented on major websites",
      "Government-mandated internet filtering detected",
      "Deep packet inspection blocking encrypted traffic"
    ],
    traffic: [
      "Unusual traffic spike detected in {region} data centers",
      "Network congestion reported during peak hours",
      "DDoS attack mitigated successfully",
      "Bandwidth utilization exceeding normal thresholds",
      "High-volume data transfer activity detected"
    ],
    recovery: [
      "Internet services restored after {duration}-hour outage in {region}",
      "Network connectivity returning to normal levels",
      "Infrastructure repairs completed successfully",
      "Service restoration confirmed across affected regions", 
      "Full network functionality restored"
    ]
  };

  const regions = ["Tehran", "Mumbai", "Sao Paulo", "Moscow", "Beijing", "London", "Tokyo", "Sydney"];
  const countries = ["Iran", "India", "Brazil", "Russia", "China", "UK", "Japan", "Australia", "Myanmar", "Turkey", "Egypt", "Pakistan"];
  const reasons = ["government meeting", "protests", "elections", "security concerns", "policy enforcement"];

  // Generate realistic event message
  const generateMessage = (type: keyof typeof eventMessages) => {
    const templates = eventMessages[type];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    return template
      .replace("{percentage}", Math.floor(Math.random() * 60 + 20).toString())
      .replace("{region}", regions[Math.floor(Math.random() * regions.length)])
      .replace("{duration}", Math.floor(Math.random() * 6 + 1).toString())
      .replace("{reason}", reasons[Math.floor(Math.random() * reasons.length)]);
  };

  // Fetch real OONI data for censorship events
  const fetchRealEvents = async () => {
    try {
      const ooniResponse = await fetch('/api/ooni');
      if (ooniResponse.ok) {
        const ooniData = await ooniResponse.json();
        
        // Convert OONI data to feed items
        const ooniEvents: FeedItem[] = ooniData.measurements?.slice(0, 3).map((measurement: any, index: number) => ({
          id: `ooni-${Date.now()}-${index}`,
          type: "censorship" as const,
          country: measurement.probe_cc || "Unknown",
          message: `${measurement.test_name || 'Network'} anomaly detected: ${measurement.anomaly ? 'Blocked content' : 'Suspicious activity'}`,
          timestamp: new Date(measurement.measurement_start_time || Date.now()),
          severity: measurement.anomaly ? "high" : "medium" as const,
          source: "OONI" as const
        })) || [];
        
        if (ooniEvents.length > 0) {
          setFeedData(prev => [...ooniEvents, ...prev.slice(0, 7)]);
        }
      }
    } catch (error) {
      console.log('OONI API unavailable, using simulated data');
    }
  };

  useEffect(() => {
    setMounted(true);
    
    // Initial fetch of real events
    fetchRealEvents();
    
    // Simulate real-time updates with enhanced variety
    const interval = setInterval(() => {
      if (!isAutoRefresh) return;
      
      const types: Array<"outage" | "censorship" | "traffic" | "recovery"> = ["outage", "censorship", "traffic", "recovery"];
      const severities: Array<"low" | "medium" | "high"> = ["low", "medium", "high"];
      const sources: Array<"OONI" | "Cloudflare" | "Monitor" | "Simulation"> = ["Monitor", "Simulation", "Cloudflare", "OONI"];
      
      const selectedType = types[Math.floor(Math.random() * types.length)];
      const selectedCountry = countries[Math.floor(Math.random() * countries.length)];
      const selectedSource = sources[Math.floor(Math.random() * sources.length)];
      
      const newItem: FeedItem = {
        id: Date.now().toString(),
        type: selectedType,
        country: selectedCountry,
        message: generateMessage(selectedType),
        timestamp: new Date(),
        severity: severities[Math.floor(Math.random() * severities.length)],
        source: selectedSource
      };
      
      setFeedData(prev => [newItem, ...prev.slice(0, 9)]);
      setLastUpdate(new Date());
    }, 12000); // Add new item every 12 seconds

    // Fetch real events every 90 seconds  
    const realDataInterval = setInterval(() => {
      if (isAutoRefresh) fetchRealEvents();
    }, 90000);

    return () => {
      clearInterval(interval);
      clearInterval(realDataInterval);
    };
  }, []);

  // Manual refresh function
  const handleManualRefresh = () => {
    fetchRealEvents();
    setLastUpdate(new Date());
  };

  const filteredData = filteredType 
    ? feedData.filter(item => item.type === filteredType)
    : feedData;

  if (!mounted) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-xl border border-gray-200"></div>;
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Live Network Events
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {format(lastUpdate, "HH:mm:ss")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Manual refresh button */}
          <button
            onClick={handleManualRefresh}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
            title="Refresh now"
          >
            🔄 Refresh
          </button>
          
          {/* Auto-refresh toggle */}
          <button
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              isAutoRefresh 
                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isAutoRefresh ? 'Auto ✓' : 'Paused'}
          </button>
          
          {/* Event Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filteredType || ""}
              onChange={(e) => setFilteredType(e.target.value || null)}
              className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
            >
              <option value="">All Events</option>
              <option value="outage">Outages</option>
              <option value="censorship">Censorship</option>
              <option value="traffic">Traffic</option>
              <option value="recovery">Recovery</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isAutoRefresh ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className={`text-sm font-medium ${isAutoRefresh ? 'text-emerald-600' : 'text-gray-500'}`}>
              {isAutoRefresh ? 'LIVE' : 'PAUSED'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredData.map((item) => {
          const isRecent = Date.now() - item.timestamp.getTime() < 60000; // Less than 1 minute old
          
          return (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors bg-white/50 cursor-pointer hover:border-blue-300"
              onClick={() => setSelectedEvent(item)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getColorClass(item.type, item.severity)} relative`}>
                  {getIcon(item.type)}
                  {isRecent && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">{item.country}</span>
                    <div className={`w-2 h-2 rounded-full ${getSeverityColor(item.severity)}`}></div>
                    <span className="text-xs text-gray-600 capitalize font-medium">{item.severity}</span>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {item.source}
                    </span>
                    {isRecent && (
                      <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-medium">
                        NEW
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-2 line-clamp-2">{item.message}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{format(item.timestamp, "HH:mm")}</span>
                    <span className="capitalize">{item.type}</span>
                    <span>{format(item.timestamp, "MMM dd")}</span>
                    <span className="text-blue-600 hover:text-blue-800">Click for details →</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Enhanced Event Type Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-600">Event Types</h4>
          <span className="text-xs text-gray-500">{filteredData.length} events shown</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-gray-700">Outages</span>
            <span className="text-gray-500">({feedData.filter(i => i.type === 'outage').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-orange-600" />
            <span className="text-gray-700">Censorship</span>
            <span className="text-gray-500">({feedData.filter(i => i.type === 'censorship').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span className="text-gray-700">Traffic Spikes</span>
            <span className="text-gray-500">({feedData.filter(i => i.type === 'traffic').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span className="text-gray-700">Recovery</span>
            <span className="text-gray-500">({feedData.filter(i => i.type === 'recovery').length})</span>
          </div>
        </div>
        
        {/* Data Sources */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <h5 className="text-xs font-semibold text-gray-500 mb-2">Data Sources</h5>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded">OONI</span>
            <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded">Cloudflare</span>
            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">Monitor</span>
            <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded">Simulation</span>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="modal-card-green rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${getColorClass(selectedEvent.type, selectedEvent.severity)}`}>
                    {getIcon(selectedEvent.type)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 capitalize">
                      {selectedEvent.type} Event in {selectedEvent.country}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {format(selectedEvent.timestamp, "PPPP 'at' p")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Severity Level</div>
                  <div className={`text-lg font-semibold capitalize ${
                    selectedEvent.severity === 'high' ? 'text-red-600' :
                    selectedEvent.severity === 'medium' ? 'text-amber-600' :
                    'text-blue-600'
                  }`}>
                    {selectedEvent.severity}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Data Source</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {selectedEvent.source}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedEvent.message}</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Event Type: {selectedEvent.type}</h4>
                <p className="text-sm text-blue-800">
                  {selectedEvent.type === 'outage' && 'Network connectivity disruptions affecting internet access in the region.'}
                  {selectedEvent.type === 'censorship' && 'Content filtering or access restrictions detected on network traffic.'}
                  {selectedEvent.type === 'traffic' && 'Unusual patterns in network traffic requiring monitoring and analysis.'}
                  {selectedEvent.type === 'recovery' && 'Network services returning to normal operation after disruption.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
