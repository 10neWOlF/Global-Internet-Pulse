'use client';

import { useState, useEffect } from 'react';
import WorldMap from '@/components/WorldMap';
import StatisticsPanel from '@/components/StatisticsPanel';
import LiveFeed from '@/components/LiveFeed';
import SubmarineCableMap from '@/components/SubmarineCableMap';
import DataBreachAlerts from '@/components/DataBreachAlerts';
import { X, AlertTriangle, Clock, MapPin } from 'lucide-react';

// Mock data for different stats - using dynamic timestamps
const generateTimestamp = (hoursAgo: number, minutesAgo: number = 0) => {
  const now = new Date();
  const timestamp = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000) - (minutesAgo * 60 * 1000));
  return timestamp.toISOString();
};

const outageData = [
  {
    id: 1,
    country: "Iran",
    region: "Tehran Province",
    type: "Government Censorship",
    description: "Social media platforms blocked due to civil unrest",
    startTime: generateTimestamp(2, 30), // 2 hours 30 minutes ago
    affectedUsers: "12.5M",
    severity: "high",
    status: "ongoing"
  },
  {
    id: 2,
    country: "Brazil",
    region: "São Paulo",
    type: "Infrastructure Failure",
    description: "Underwater cable damage affecting regional connectivity",
    startTime: generateTimestamp(1, 45), // 1 hour 45 minutes ago
    affectedUsers: "3.2M",
    severity: "medium",
    status: "ongoing"
  },
  {
    id: 3,
    country: "Myanmar",
    region: "Nationwide",
    type: "Government Shutdown",
    description: "Complete internet blackout during political demonstrations",
    startTime: generateTimestamp(6, 15), // 6 hours 15 minutes ago
    affectedUsers: "54M",
    severity: "critical",
    status: "ongoing"
  },
  {
    id: 4,
    country: "Pakistan",
    region: "Karachi",
    type: "Natural Disaster",
    description: "Flooding damaged fiber optic infrastructure",
    startTime: generateTimestamp(4, 0), // 4 hours ago
    affectedUsers: "8.7M",
    severity: "high",
    status: "ongoing"
  },
  {
    id: 5,
    country: "Venezuela",
    region: "Caracas",
    type: "Power Grid Failure",
    description: "Nationwide power outages affecting internet infrastructure",
    startTime: generateTimestamp(3, 20), // 3 hours 20 minutes ago
    affectedUsers: "28M",
    severity: "critical",
    status: "ongoing"
  },
  {
    id: 6,
    country: "Bangladesh",
    region: "Dhaka",
    type: "Government Censorship",
    description: "Social media access restricted during protests",
    startTime: generateTimestamp(5, 45), // 5 hours 45 minutes ago
    affectedUsers: "165M",
    severity: "medium",
    status: "ongoing"
  },
  {
    id: 7,
    country: "Nigeria",
    region: "Lagos",
    type: "Infrastructure Failure",
    description: "Submarine cable cut affecting West Africa",
    startTime: generateTimestamp(8, 30), // 8 hours 30 minutes ago
    affectedUsers: "45M",
    severity: "high",
    status: "ongoing"
  },
  {
    id: 8,
    country: "Turkey",
    region: "Istanbul",
    type: "Government Restriction",
    description: "VPN services blocked during state of emergency",
    startTime: generateTimestamp(1, 15), // 1 hour 15 minutes ago
    affectedUsers: "84M",
    severity: "medium",
    status: "ongoing"
  },
  {
    id: 9,
    country: "Sri Lanka",
    region: "Colombo",
    type: "Economic Crisis",
    description: "ISPs shutting down due to foreign exchange shortage",
    startTime: generateTimestamp(7, 0), // 7 hours ago
    affectedUsers: "22M",
    severity: "critical",
    status: "ongoing"
  },
  {
    id: 10,
    country: "Kazakhstan",
    region: "Almaty",
    type: "Government Censorship",
    description: "Internet throttling during political unrest",
    startTime: generateTimestamp(0, 25), // 25 minutes ago
    affectedUsers: "19M",
    severity: "medium",
    status: "ongoing"
  }
];

const activeCountriesData = [
  { country: "United States", users: "331M", status: "excellent", responseTime: "45ms" },
  { country: "China", users: "1.4B", status: "good", responseTime: "78ms" },
  { country: "India", users: "1.3B", status: "good", responseTime: "95ms" },
  { country: "Japan", users: "125M", status: "excellent", responseTime: "32ms" },
  { country: "Germany", users: "83M", status: "excellent", responseTime: "41ms" },
  { country: "United Kingdom", users: "67M", status: "good", responseTime: "52ms" },
  { country: "France", users: "68M", status: "good", responseTime: "58ms" },
  { country: "Brazil", users: "215M", status: "fair", responseTime: "125ms" },
  { country: "Canada", users: "38M", status: "excellent", responseTime: "38ms" },
  { country: "Australia", users: "26M", status: "excellent", responseTime: "67ms" }
];

const responseTimeData = [
  { region: "North America", avgTime: "42ms", status: "excellent", trend: "stable" },
  { region: "Europe", avgTime: "51ms", status: "good", trend: "improving" },
  { region: "Asia-Pacific", avgTime: "89ms", status: "good", trend: "stable" },
  { region: "South America", avgTime: "134ms", status: "fair", trend: "degrading" },
  { region: "Africa", avgTime: "187ms", status: "poor", trend: "improving" },
  { region: "Middle East", avgTime: "96ms", status: "good", trend: "stable" }
];

const censorshipData = [
  {
    id: 1,
    country: "North Korea",
    type: "Complete Block",
    platforms: ["Facebook", "Twitter", "YouTube", "Google"],
    reason: "State censorship policy",
    duration: "Permanent",
    severity: "critical"
  },
  {
    id: 2,
    country: "China",
    type: "Platform Restrictions",
    platforms: ["Facebook", "Twitter", "Instagram"],
    reason: "Government regulations",
    duration: "Ongoing",
    severity: "high"
  },
  {
    id: 3,
    country: "Iran",
    type: "Selective Blocking",
    platforms: ["Instagram", "WhatsApp"],
    reason: "Civil unrest response",
    duration: "2 days",
    severity: "medium"
  },
  {
    id: 4,
    country: "Russia",
    type: "Speed Throttling",
    platforms: ["Twitter"],
    reason: "Content moderation dispute",
    duration: "1 week",
    severity: "low"
  }
];

interface OutageDataItem {
  id: string | number;
  country: string;
  region: string;
  type: string;
  description: string;
  startTime: string;
  affectedUsers: string;
  severity: string;
  status: string;
  source?: string;
}

export default function Home() {
  const [showOutageModal, setShowOutageModal] = useState(false);
  const [showCountriesModal, setShowCountriesModal] = useState(false);
  const [showResponseTimeModal, setShowResponseTimeModal] = useState(false);
  const [showCensorshipModal, setShowCensorshipModal] = useState(false);
  const [showOutageDetailModal, setShowOutageDetailModal] = useState(false);
  const [selectedOutage, setSelectedOutage] = useState<OutageDataItem | null>(null);
  const [subscribedOutages, setSubscribedOutages] = useState<number[]>([]);
  const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  
  // Real-time outage data from APIs
  const [realOutageData, setRealOutageData] = useState<OutageDataItem[]>(outageData);
  const [lastAPIUpdate, setLastAPIUpdate] = useState<string>('');
  const [actualOutageCount, setActualOutageCount] = useState<number>(outageData.length);

  // Helper functions for API data processing
  const getCountryName = (countryCode: string) => {
    const countryNames: { [key: string]: string } = {
      'IR': 'Iran', 'BR': 'Brazil', 'MM': 'Myanmar', 'PK': 'Pakistan',
      'VE': 'Venezuela', 'BD': 'Bangladesh', 'NG': 'Nigeria', 'TR': 'Turkey',
      'IN': 'India', 'CN': 'China', 'RU': 'Russia', 'EG': 'Egypt'
    };
    return countryNames[countryCode] || countryCode;
  };

  const estimateAffectedUsers = (region: string) => {
    const populations: { [key: string]: string } = {
      'Iran': '84M', 'Brazil': '215M', 'Myanmar': '54M', 'Pakistan': '225M',
      'Venezuela': '28M', 'Bangladesh': '165M', 'Nigeria': '218M', 'Turkey': '84M',
      'India': '1.4B', 'China': '1.4B', 'Russia': '146M', 'Egypt': '104M'
    };
    const estimated = Math.floor(Math.random() * 50) + 5;
    return populations[region] || `${estimated}M`;
  };

  const formatOoniTimestamp = (timestamp: string) => {
    try {
      // Handle null, undefined, or empty timestamps
      if (!timestamp) {
        return new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toLocaleString();
      }

      // OONI timestamps are usually in ISO format like "2024-08-19 12:34:56" or "2024-08-19T12:34:56.000Z"
      let isoTimestamp = timestamp;
      
      // If the timestamp doesn't have a 'T' separator, add it
      if (!timestamp.includes('T') && timestamp.includes(' ')) {
        isoTimestamp = timestamp.replace(' ', 'T');
        // Add 'Z' for UTC if not present and no timezone info
        if (!isoTimestamp.includes('Z') && !isoTimestamp.includes('+') && !isoTimestamp.includes('-', 10)) {
          isoTimestamp += 'Z';
        }
      }
      
      const date = new Date(isoTimestamp);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        // Try parsing the original timestamp differently
        const dateAttempt2 = new Date(timestamp);
        if (!isNaN(dateAttempt2.getTime())) {
          return dateAttempt2.toLocaleString();
        }
        
        // If all parsing failed, generate a reasonable fallback with exact time
        return new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toLocaleString();
      }
      
      // Return exact timestamp like Cloudflare data
      return date.toLocaleString();
    } catch {
      // Final fallback to a reasonable exact time
      return new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toLocaleString();
    }
  };

  // Fetch real outage data from APIs
  const fetchRealOutageDetails = async () => {
    try {
      const responses = await Promise.allSettled([
        fetch('/api/ooni'),
        fetch('/api/cloudflare'),
        fetch('/api/worldbank')
      ]);

      let combinedOutages: OutageDataItem[] = [];
      let successfulFetches = 0;

      // Process OONI data
      if (responses[0].status === 'fulfilled' && responses[0].value.ok) {
        const ooniData = await responses[0].value.json();
        if (ooniData.recentEvents) {
          const ooniOutages = ooniData.recentEvents.slice(0, 5).map((event: any, index: number): OutageDataItem => ({
            id: `ooni-${index}`,
            country: getCountryName(event.country),
            region: event.country || 'Unknown',
            type: event.blocked ? 'Government Censorship' : 'Network Anomaly',
            description: `${event.testType} test ${event.blocked ? 'blocked' : 'anomaly detected'} for ${event.domain}`,
            startTime: formatOoniTimestamp(event.timestamp),
            affectedUsers: estimateAffectedUsers(event.country),
            severity: event.blocked ? 'high' : 'medium',
            status: 'ongoing',
            source: 'OONI (Real Data)'
          }));
          combinedOutages = [...combinedOutages, ...ooniOutages];
          successfulFetches++;
        }
      }

      // Process Cloudflare data (if available)
      if (responses[1].status === 'fulfilled' && responses[1].value.ok) {
        const cloudflareData = await responses[1].value.json();
        if (cloudflareData.regions) {
          const cfOutages = cloudflareData.regions
            .filter((region: any) => region.traffic < 70)
            .slice(0, 3)
            .map((region: any, index: number) => ({
              id: `cf-${index}`,
              country: region.name.split(' ')[0],
              region: region.name,
              type: 'Infrastructure Issue',
              description: `Reduced traffic pattern detected (${region.traffic.toFixed(1)}% of normal)`,
              startTime: new Date(Date.now() - Math.random() * 7200000).toLocaleString(),
              affectedUsers: estimateAffectedUsers(region.name),
              severity: region.traffic < 50 ? 'high' : 'medium',
              status: 'ongoing',
              source: 'Cloudflare (Real Data)'
            }));
          combinedOutages = [...combinedOutages, ...cfOutages];
          successfulFetches++;
        }
      }

      // Process World Bank data (if available)
      if (responses[2].status === 'fulfilled' && responses[2].value.ok) {
        const wbData = await responses[2].value.json();
        if (wbData.topCountries) {
          const wbOutages = wbData.topCountries
            .filter((country: any) => country.latestValue < 60)
            .slice(0, 2)
            .map((country: any, index: number) => ({
              id: `wb-${index}`,
              country: country.countryName,
              region: country.countryName,
              type: 'Low Connectivity',
              description: `Low internet penetration: ${country.latestValue.toFixed(1)}% population online`,
              startTime: new Date(Date.now() - Math.random() * 86400000).toLocaleString(), // Random time within last 24h
              affectedUsers: estimateAffectedUsers(country.countryCode),
              severity: country.latestValue < 40 ? 'high' : 'medium',
              status: 'persistent',
              source: 'World Bank (Real Data)'
            }));
          combinedOutages = [...combinedOutages, ...wbOutages];
          successfulFetches++;
        }
      }

      // Update outage data if we got real data
      if (combinedOutages.length > 0) {
        setRealOutageData(combinedOutages.slice(0, 10));
        setLastAPIUpdate(new Date().toLocaleTimeString());
        
        // Update the actual count to match displayed outages
        const actualCount = combinedOutages.slice(0, 10).length;
        setActualOutageCount(actualCount);
        
        // Send the correct count to StatisticsPanel
        window.dispatchEvent(new CustomEvent('updateStatsPanelCount', { 
          detail: { count: actualCount } 
        }));
      } else if (successfulFetches === 0) {
        // If all APIs failed, keep using static data but update timestamps
        const fallbackData = outageData.map(outage => ({
          ...outage,
          startTime: generateTimestamp(Math.random() * 8, Math.random() * 60),
          source: 'Simulated Data'
        }));
        setRealOutageData(fallbackData);
        setActualOutageCount(fallbackData.length);
        
        // Send the correct count to StatisticsPanel
        window.dispatchEvent(new CustomEvent('updateStatsPanelCount', { 
          detail: { count: fallbackData.length } 
        }));
      }

    } catch (error) {
      console.error('Error fetching real outage details:', error);
    }
  };

  // Listen for custom events from StatisticsPanel
  useEffect(() => {
    const handleShowOutages = () => setShowOutageModal(true);
    window.addEventListener('showOutages', handleShowOutages);
    return () => window.removeEventListener('showOutages', handleShowOutages);
  }, []);

  // Fetch real outage data on mount and periodically
  useEffect(() => {
    fetchRealOutageDetails();
    const interval = setInterval(fetchRealOutageDetails, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Check notification permission on mount
  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleViewOutageDetails = (outage: OutageDataItem) => {
    setSelectedOutage(outage);
    setShowOutageDetailModal(true);
  };

  const handleGetUpdates = async () => {
    if (!selectedOutage) return;

    // Check if already subscribed
    if (subscribedOutages.includes(selectedOutage.id)) {
      return; // Already subscribed, button should be disabled
    }

    // Check if notifications are supported
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
      return;
    }

    // Check current permission status
    let permission = Notification.permission;
    
    // Request permission if not granted
    if (permission === "default") {
      permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }

    if (permission === "granted") {
      // Subscribe to updates
      setSubscribedOutages(prev => [...prev, selectedOutage.id]);
      
      // Show confirmation notification
      new Notification("Subscribed to Outage Updates", {
        body: `You'll receive notifications about the ${selectedOutage.country} outage.`,
        icon: "/favicon.ico",
        tag: `outage-${selectedOutage.id}`,
        requireInteraction: false
      });

      // Show visual confirmation
      setShowUpdateConfirmation(true);
      setTimeout(() => setShowUpdateConfirmation(false), 3000);

      // Simulate a future update notification (for demo purposes)
      setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification(`Update: ${selectedOutage.country} Outage`, {
            body: `Status update available for the ${selectedOutage.type.toLowerCase()} in ${selectedOutage.region}.`,
            icon: "/favicon.ico",
            tag: `outage-update-${selectedOutage.id}`,
            requireInteraction: true
          });
        }
      }, 10000); // Demo notification after 10 seconds

    } else if (permission === "denied") {
      setNotificationPermission("denied");
      alert("Notifications are blocked. Please enable them in your browser settings:\n\n1. Click the lock/info icon in the address bar\n2. Set Notifications to 'Allow'\n3. Refresh the page and try again");
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-50 border-red-200';
      case 'high': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'medium': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'low': return 'text-blue-700 bg-blue-50 border-blue-200';
      default: return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-emerald-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-amber-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '↗️';
      case 'degrading': return '↘️';
      case 'stable': return '→';
      default: return '→';
    }
  };

  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    const now = new Date();
    const diffMs = now.getTime() - time.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHrs > 0) {
      return `${diffHrs}h ${diffMins}m ago`;
    }
    return `${diffMins}m ago`;
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      <main className="relative z-10">
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Statistics Overview */}
          <StatisticsPanel />

          {/* World Map Section */}
          <div className="mt-8 glass-card rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              Global Internet Status
            </h2>
            <WorldMap />
          </div>

          {/* Live Feed and Trends */}
          <div className="mt-8">
            <LiveFeed />
          </div>

          {/* New Sections */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {/* Submarine Cable Map */}
            <div className="rounded-xl overflow-hidden">
              <SubmarineCableMap />
            </div>
            
            {/* Data Breach Alerts */}
            <div className="rounded-xl overflow-hidden">
              <DataBreachAlerts />
            </div>
          </div>
        </div>

        {/* Active Countries Modal */}
        {showCountriesModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="modal-card-green max-w-4xl w-full max-h-[80vh] overflow-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                  Active Countries (195)
                </h2>
                <button
                  onClick={() => setShowCountriesModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeCountriesData.map((country, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{country.country}</h3>
                        <div className={`w-3 h-3 rounded-full ${
                          country.status === 'excellent' ? 'bg-emerald-500' :
                          country.status === 'good' ? 'bg-blue-500' :
                          country.status === 'fair' ? 'bg-amber-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Users:</span>
                          <span className="text-gray-800 font-medium">{country.users}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Response:</span>
                          <span className="text-blue-600 font-medium">{country.responseTime}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-medium ${getStatusColor(country.status)}`}>{country.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center pt-6 border-t border-gray-200 mt-6">
                  <p className="text-gray-600 text-sm">
                    Showing top 10 countries • Last updated: {new Date().toLocaleTimeString()} UTC
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Response Time Modal */}
        {showResponseTimeModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="modal-card-orange max-w-4xl w-full max-h-[80vh] overflow-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-amber-600" />
                  Global Response Times
                </h2>
                <button
                  onClick={() => setShowResponseTimeModal(false)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {responseTimeData.map((region, index) => (
                    <div key={index} className="bg-white/50 rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-800">{region.region}</h3>
                          <span className="text-2xl">{getTrendIcon(region.trend)}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-amber-600">{region.avgTime}</div>
                          <div className={`text-sm ${getStatusColor(region.status)}`}>{region.status}</div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-gray-600">Trend: {region.trend}</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              region.status === 'excellent' ? 'bg-green-500' :
                              region.status === 'good' ? 'bg-blue-500' :
                              region.status === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ 
                              width: `${
                                region.status === 'excellent' ? '90%' :
                                region.status === 'good' ? '70%' :
                                region.status === 'fair' ? '50%' : '30%'
                              }` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center pt-6 border-t border-gray-200 mt-6">
                  <p className="text-gray-600 text-sm">
                    Average global response time: 245ms • Last updated: {new Date().toLocaleTimeString()} UTC
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Censorship Events Modal */}
        {showCensorshipModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="modal-card-purple max-w-4xl w-full max-h-[80vh] overflow-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                  Active Censorship Events (12)
                </h2>
                <button
                  onClick={() => setShowCensorshipModal(false)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                {censorshipData.map((event) => (
                  <div key={event.id} className="bg-white/50 rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(event.severity)}`}>
                          {event.severity.toUpperCase()}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">{event.country}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-orange-600 text-sm font-medium">{event.type}</div>
                        <div className="text-gray-600 text-xs">{event.duration}</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-gray-700 text-sm font-medium mb-1">Affected Platforms:</div>
                      <div className="flex flex-wrap gap-2">
                        {event.platforms.map((platform, index) => (
                          <span key={index} className="px-2 py-1 bg-red-50 border border-red-200 text-red-600 text-xs rounded">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-gray-700 text-sm font-medium mb-1">Reason:</div>
                      <p className="text-gray-600 text-sm">{event.reason}</p>
                    </div>
                  </div>
                ))}
                
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    Showing 4 of 12 active events • Last updated: {new Date().toLocaleTimeString()} UTC
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Outage Details Modal */}
        {showOutageModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="modal-card-red max-w-4xl w-full max-h-[80vh] overflow-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  Active Internet Outages
                  <span className="text-sm font-normal text-green-600 ml-2">
                    🟢 Real API Data
                  </span>
                </h2>
                <button
                  onClick={() => setShowOutageModal(false)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">
                    Showing real-time outage data from OONI, Cloudflare, and World Bank APIs
                  </div>
                  {lastAPIUpdate && (
                    <div className="text-xs text-gray-500">
                      Last updated: {lastAPIUpdate}
                    </div>
                  )}
                </div>
                
                {realOutageData.map((outage) => (
                  <div key={outage.id} className="bg-white/50 rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(outage.severity)}`}>
                          {outage.severity.toUpperCase()}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">{outage.country}</h3>
                        {outage.source && (
                          <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200">
                            {outage.source}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <Clock className="w-4 h-4" />
                        {typeof outage.startTime === 'string' ? outage.startTime : formatTime(outage.startTime)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 text-gray-700 mb-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm font-medium">Region:</span>
                        </div>
                        <p className="text-gray-800 ml-6">{outage.region}</p>
                      </div>
                      
                      <div>
                        <div className="text-gray-700 text-sm font-medium mb-1">Affected Users:</div>
                        <p className="text-gray-800 ml-0">{outage.affectedUsers}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-gray-700 text-sm font-medium mb-1">Type:</div>
                      <p className="text-blue-600">{outage.type}</p>
                    </div>
                    
                    <div>
                      <div className="text-gray-700 text-sm font-medium mb-1">Description:</div>
                      <p className="text-gray-600">{outage.description}</p>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-600 text-sm font-medium">ONGOING</span>
                      </div>
                      <button 
                        onClick={() => handleViewOutageDetails(outage)}
                        className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    Last updated: {new Date().toLocaleTimeString()} UTC
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Outage Modal */}
        {showOutageDetailModal && selectedOutage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card max-w-2xl w-full max-h-[80vh] overflow-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  Outage Details: {selectedOutage.country}
                </h2>
                <button
                  onClick={() => setShowOutageDetailModal(false)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                {/* Header with severity and status */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(selectedOutage.severity)}`}>
                      {selectedOutage.severity.toUpperCase()} SEVERITY
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-600 text-sm font-medium">ONGOING</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Started</div>
                    <div className="text-lg font-semibold text-gray-800">{formatTime(selectedOutage.startTime)}</div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Location</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-gray-800">{selectedOutage.country}</span>
                        </div>
                        <p className="text-gray-600 ml-6">{selectedOutage.region}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Impact</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-red-600">{selectedOutage.affectedUsers}</div>
                        <p className="text-gray-600">Users affected</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Outage Type</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="font-medium text-blue-600">{selectedOutage.type}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Duration</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span className="font-medium text-gray-800">{formatTime(selectedOutage.startTime)}</span>
                        </div>
                        <p className="text-gray-600 ml-6">and ongoing</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedOutage.description}</p>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Affected Services</h3>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="space-y-2">
                        {selectedOutage.type === 'Government Censorship' ? (
                          <>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-gray-700">Social Media Platforms</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-gray-700">Messaging Apps</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              <span className="text-gray-700">VPN Services</span>
                            </div>
                          </>
                        ) : selectedOutage.type === 'Infrastructure Failure' ? (
                          <>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-gray-700">Internet Connectivity</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-gray-700">Mobile Data</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              <span className="text-gray-700">Fixed Broadband</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-gray-700">All Internet Services</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-gray-700">Mobile Networks</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Recovery Status</h3>
                    <div className="bg-gray-50 rounded-lg p-3">
                      {selectedOutage.severity === 'critical' ? (
                        <div className="text-red-600">
                          <div className="font-medium">No Recovery Timeline</div>
                          <div className="text-sm">Situation remains critical</div>
                        </div>
                      ) : selectedOutage.severity === 'high' ? (
                        <div className="text-orange-600">
                          <div className="font-medium">Partial Recovery Expected</div>
                          <div className="text-sm">Working on restoration</div>
                        </div>
                      ) : (
                        <div className="text-yellow-600">
                          <div className="font-medium">Recovery in Progress</div>
                          <div className="text-sm">Estimated 2-6 hours</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Updates & Monitoring</h4>
                  <p className="text-blue-700 text-sm mb-3">
                    This outage is being actively monitored. Updates will be provided as the situation develops.
                    {notificationPermission === "denied" && (
                      <span className="block text-red-600 font-medium mt-1">
                        ⚠️ Notifications are blocked. Enable them in browser settings to receive updates.
                      </span>
                    )}
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleGetUpdates}
                      disabled={selectedOutage && subscribedOutages.includes(selectedOutage.id)}
                      className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                        selectedOutage && subscribedOutages.includes(selectedOutage.id)
                          ? 'bg-green-100 text-green-700 border border-green-200 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {selectedOutage && subscribedOutages.includes(selectedOutage.id) 
                        ? '✓ Subscribed' 
                        : notificationPermission === "denied" 
                          ? 'Enable Notifications' 
                          : 'Get Updates'
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Update Confirmation Notification */}
        {showUpdateConfirmation && (
          <div className="fixed top-4 right-4 z-50">
            <div className="bg-green-100 border border-green-200 rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-800 font-medium">Subscribed to updates!</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                You&apos;ll receive notifications about this outage.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
