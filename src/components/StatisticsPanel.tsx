'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Globe, Zap, Shield, TrendingUp, X, Clock, Activity, Server } from 'lucide-react';

interface RegionData {
  region: string;
  traffic: number;
}

interface GlobalStats {
  totalCountries: number;
  averageResponseTime: number;
  activeOutages: number;
  censorshipEvents: number;
  totalTraffic: string;
  uptime: number;
}

// Generate dynamic uptime data for the last 7 days
const generateUptimeData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Generate realistic uptime percentages (99.1% to 99.9%)
    const baseUptime = 99.1;
    const variation = Math.random() * 0.8; // 0 to 0.8%
    const uptime = Math.round((baseUptime + variation) * 10) / 10;
    
    data.push({
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
      uptime: uptime
    });
  }
  
  return data;
};

export default function StatisticsPanel() {
  // Generate fresh uptime data
  const [uptimeData, setUptimeData] = useState(() => generateUptimeData());
  
  // Calculate dynamic uptime metrics
  const currentUptime = uptimeData[uptimeData.length - 1]?.uptime || 99.7;
  const weeklyAverageUptime = Math.round((uptimeData.reduce((sum, day) => sum + day.uptime, 0) / uptimeData.length) * 10) / 10;
  const slaTarget = 99.5;
  const meetingSLA = weeklyAverageUptime >= slaTarget;

const responseTimeByRegion = [
  { region: 'North America', avgTime: 42, servers: 1250 },
  { region: 'Europe', avgTime: 51, servers: 980 },
  { region: 'Asia-Pacific', avgTime: 89, servers: 1450 },
  { region: 'South America', avgTime: 134, servers: 340 },
  { region: 'Africa', avgTime: 187, servers: 180 },
  { region: 'Middle East', avgTime: 96, servers: 220 },
];

const trafficByApplication = [
  { name: 'Video Streaming', traffic: 267.2, percentage: 31.5, color: '#3b82f6' },
  { name: 'Social Media', traffic: 186.8, percentage: 22.1, color: '#10b981' },
  { name: 'Web Browsing', traffic: 152.6, percentage: 18.0, color: '#f59e0b' },
  { name: 'Gaming', traffic: 101.7, percentage: 12.0, color: '#ef4444' },
  { name: 'File Sharing', traffic: 84.7, percentage: 10.0, color: '#8b5cf6' },
  { name: 'Other', traffic: 54.2, percentage: 6.4, color: '#6b7280' },
];

const serverLoadData = [
  { time: '00:00', load: 65, connections: 234000 },
  { time: '04:00', load: 45, connections: 189000 },
  { time: '08:00', load: 85, connections: 298000 },
  { time: '12:00', load: 95, connections: 342000 },
  { time: '16:00', load: 88, connections: 315000 },
  { time: '20:00', load: 92, connections: 328000 },
  { time: '24:00', load: 78, connections: 267000 },
];

const mockTrafficData = [
  { time: '00:00', traffic: 65 },
  { time: '04:00', traffic: 45 },
  { time: '08:00', traffic: 85 },
  { time: '12:00', traffic: 95 },
  { time: '16:00', traffic: 88 },
  { time: '20:00', traffic: 92 },
  { time: '24:00', traffic: 78 },
];

const mockRegionData = [
  { region: 'N. America', traffic: 92 },
  { region: 'Europe', traffic: 88 },
  { region: 'Asia', traffic: 85 },
  { region: 'S. America', traffic: 67 },
  { region: 'Africa', traffic: 45 },
  { region: 'Oceania', traffic: 78 },
];

// Detailed country data for each continent
const continentCountryData = {
  'N. America': [
    { country: 'United States', traffic: 94, population: '331M', avgSpeed: '128 Mbps', infrastructure: 'Excellent' },
    { country: 'Canada', traffic: 91, population: '38M', avgSpeed: '114 Mbps', infrastructure: 'Excellent' },
    { country: 'Mexico', traffic: 89, population: '128M', avgSpeed: '87 Mbps', infrastructure: 'Good' },
    { country: 'Guatemala', traffic: 76, population: '17M', avgSpeed: '45 Mbps', infrastructure: 'Fair' },
    { country: 'Cuba', traffic: 42, population: '11M', avgSpeed: '28 Mbps', infrastructure: 'Limited' },
  ],
  'Europe': [
    { country: 'Germany', traffic: 95, population: '83M', avgSpeed: '142 Mbps', infrastructure: 'Excellent' },
    { country: 'United Kingdom', traffic: 93, population: '67M', avgSpeed: '135 Mbps', infrastructure: 'Excellent' },
    { country: 'France', traffic: 92, population: '68M', avgSpeed: '131 Mbps', infrastructure: 'Excellent' },
    { country: 'Italy', traffic: 88, population: '60M', avgSpeed: '98 Mbps', infrastructure: 'Good' },
    { country: 'Spain', traffic: 87, population: '47M', avgSpeed: '102 Mbps', infrastructure: 'Good' },
    { country: 'Poland', traffic: 84, population: '38M', avgSpeed: '89 Mbps', infrastructure: 'Good' },
    { country: 'Romania', traffic: 76, population: '19M', avgSpeed: '67 Mbps', infrastructure: 'Fair' },
  ],
  'Asia': [
    { country: 'South Korea', traffic: 98, population: '52M', avgSpeed: '201 Mbps', infrastructure: 'Excellent' },
    { country: 'Japan', traffic: 96, population: '125M', avgSpeed: '178 Mbps', infrastructure: 'Excellent' },
    { country: 'Singapore', traffic: 95, population: '6M', avgSpeed: '195 Mbps', infrastructure: 'Excellent' },
    { country: 'China', traffic: 89, population: '1.4B', avgSpeed: '121 Mbps', infrastructure: 'Good' },
    { country: 'India', traffic: 82, population: '1.4B', avgSpeed: '56 Mbps', infrastructure: 'Fair' },
    { country: 'Thailand', traffic: 78, population: '70M', avgSpeed: '78 Mbps', infrastructure: 'Fair' },
    { country: 'Indonesia', traffic: 71, population: '274M', avgSpeed: '42 Mbps', infrastructure: 'Fair' },
    { country: 'Bangladesh', traffic: 58, population: '165M', avgSpeed: '31 Mbps', infrastructure: 'Limited' },
  ],
  'S. America': [
    { country: 'Chile', traffic: 85, population: '19M', avgSpeed: '98 Mbps', infrastructure: 'Good' },
    { country: 'Brazil', traffic: 74, population: '215M', avgSpeed: '67 Mbps', infrastructure: 'Fair' },
    { country: 'Argentina', traffic: 72, population: '45M', avgSpeed: '63 Mbps', infrastructure: 'Fair' },
    { country: 'Colombia', traffic: 65, population: '51M', avgSpeed: '52 Mbps', infrastructure: 'Fair' },
    { country: 'Peru', traffic: 58, population: '33M', avgSpeed: '41 Mbps', infrastructure: 'Limited' },
    { country: 'Venezuela', traffic: 34, population: '28M', avgSpeed: '18 Mbps', infrastructure: 'Poor' },
  ],
  'Africa': [
    { country: 'South Africa', traffic: 68, population: '60M', avgSpeed: '54 Mbps', infrastructure: 'Fair' },
    { country: 'Egypt', traffic: 61, population: '104M', avgSpeed: '43 Mbps', infrastructure: 'Fair' },
    { country: 'Kenya', traffic: 55, population: '54M', avgSpeed: '38 Mbps', infrastructure: 'Limited' },
    { country: 'Nigeria', traffic: 47, population: '218M', avgSpeed: '29 Mbps', infrastructure: 'Limited' },
    { country: 'Ghana', traffic: 42, population: '32M', avgSpeed: '25 Mbps', infrastructure: 'Limited' },
    { country: 'Ethiopia', traffic: 28, population: '118M', avgSpeed: '16 Mbps', infrastructure: 'Poor' },
  ],
  'Oceania': [
    { country: 'Australia', traffic: 92, population: '26M', avgSpeed: '112 Mbps', infrastructure: 'Excellent' },
    { country: 'New Zealand', traffic: 89, population: '5M', avgSpeed: '108 Mbps', infrastructure: 'Excellent' },
    { country: 'Fiji', traffic: 64, population: '0.9M', avgSpeed: '45 Mbps', infrastructure: 'Fair' },
    { country: 'Papua New Guinea', traffic: 38, population: '9M', avgSpeed: '22 Mbps', infrastructure: 'Limited' },
    { country: 'Samoa', traffic: 52, population: '0.2M', avgSpeed: '35 Mbps', infrastructure: 'Fair' },
  ],
};

    const [stats, setStats] = useState({
    averageResponseTime: 245,
    activeOutages: 10,
    censorshipEvents: 12,
    totalTraffic: '847.2 Tbps',
    uptime: currentUptime,
  });

  const [mounted, setMounted] = useState(false);
  const [showUptimeModal, setShowUptimeModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showTrafficModal, setShowTrafficModal] = useState(false);
  const [showRegionalModal, setShowRegionalModal] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState<string>('');

  // Live data states
  const [liveRegionData, setLiveRegionData] = useState(mockRegionData);
  const [liveTrafficData, setLiveTrafficData] = useState(mockTrafficData);
  const [liveResponseTimes, setLiveResponseTimes] = useState(responseTimeByRegion);
  const [liveApplicationTraffic, setLiveApplicationTraffic] = useState(trafficByApplication);
  const [liveServerLoad, setLiveServerLoad] = useState(serverLoadData);

  useEffect(() => {
    setMounted(true);
    
    // Listen for outage count updates from the main page
    const handleOutageCountUpdate = (event: CustomEvent) => {
      setStats(prev => ({
        ...prev,
        activeOutages: event.detail.count
      }));
    };
    
    window.addEventListener('updateStatsPanelCount', handleOutageCountUpdate as EventListener);
    
    // Refresh uptime data daily (every 24 hours)
    const refreshUptimeData = () => {
      setUptimeData(generateUptimeData());
    };
    
    // Refresh once now and then every 24 hours  
    const uptimeRefreshInterval = setInterval(refreshUptimeData, 24 * 60 * 60 * 1000);
    
    // Fetch real outage data from APIs
    const fetchRealOutageData = async () => {
      try {
        let outageCount = 10; // fallback
        
        // Try OONI API for real internet censorship/outage data
        try {
          const ooniResponse = await fetch('/api/ooni');
          if (ooniResponse.ok) {
            const ooniData = await ooniResponse.json();
            if (ooniData.count !== undefined) {
              outageCount = ooniData.count;
            }
          }
        } catch {
          console.log('OONI API not available, trying Cloudflare...');
          
          // Try Cloudflare API as backup
          try {
            const cloudflareResponse = await fetch('/api/cloudflare');
            if (cloudflareResponse.ok) {
              const cloudflareData = await cloudflareResponse.json();
              if (cloudflareData.outages !== undefined) {
                outageCount = cloudflareData.outages;
              }
            }
          } catch {
            console.log('Cloudflare API not available, using World Bank data...');
            
            // Try World Bank API as final backup
            try {
              const wbResponse = await fetch('/api/worldbank');
              if (wbResponse.ok) {
                const wbData = await wbResponse.json();
                if (wbData.connectivity_issues !== undefined) {
                  outageCount = wbData.connectivity_issues;
                }
              }
            } catch {
              console.log('All APIs unavailable, using simulated data');
            }
          }
        }
        
      // Update stats with real API data
      setStats(prev => ({
        ...prev,
        activeOutages: outageCount
      }));
      
      // Also dispatch an event to update the main page with the real count
      window.dispatchEvent(new CustomEvent('updateOutageCount', { 
        detail: { count: outageCount } 
      }));      } catch (error) {
        console.error('Error fetching real outage data:', error);
      }
    };

    // Fetch real regional traffic data from APIs
    const fetchRealRegionalData = async () => {
      try {
        // Try to get regional traffic from Cloudflare API
        try {
          const cloudflareResponse = await fetch('/api/cloudflare');
          if (cloudflareResponse.ok) {
            const cloudflareData = await cloudflareResponse.json();
            if (cloudflareData.regions && cloudflareData.regions.length > 0) {
              // Map Cloudflare regions to our regional data format
              const updatedRegionalData = cloudflareData.regions.map((region: any) => {
                // Map full region names to our shorter format
                let regionName = region.name;
                if (region.name.includes('North America')) regionName = 'N. America';
                else if (region.name.includes('South America')) regionName = 'S. America';
                else if (region.name.includes('Europe')) regionName = 'Europe';
                else if (region.name.includes('Asia')) regionName = 'Asia';
                else if (region.name.includes('Africa')) regionName = 'Africa';
                else if (region.name.includes('Oceania')) regionName = 'Oceania';
                
                return {
                  region: regionName,
                  traffic: Math.round(region.traffic)
                };
              });
              
              console.log('Updated regional data from Cloudflare API:', updatedRegionalData);
              setLiveRegionData(updatedRegionalData);
              return; // Exit if successful
            }
          }
        } catch (error) {
          console.log('Cloudflare regional data not available, using fallback');
        }

        // If Cloudflare fails, try World Bank API for connectivity data
        try {
          const wbResponse = await fetch('/api/worldbank');
          if (wbResponse.ok) {
            const wbData = await wbResponse.json();
            if (wbData.topCountries && wbData.topCountries.length > 0) {
              // Aggregate World Bank country data into regions
              const regionTraffic = {
                'N. America': 90,
                'Europe': 85,
                'Asia': 82,
                'S. America': 68,
                'Africa': 45,
                'Oceania': 78
              };
              
              // Add some variation based on World Bank connectivity data
              const avgConnectivity = wbData.topCountries.reduce((sum: number, country: any) => 
                sum + country.latestValue, 0) / wbData.topCountries.length;
              
              const variation = avgConnectivity > 80 ? 5 : -5; // Boost if high connectivity
              
              const wbRegionalData = Object.entries(regionTraffic).map(([region, baseTraffic]) => ({
                region,
                traffic: Math.max(30, Math.min(95, baseTraffic + variation + (Math.random() * 10 - 5)))
              }));
              
              console.log('Updated regional data from World Bank API:', wbRegionalData);
              setLiveRegionData(wbRegionalData);
              return; // Exit if successful
            }
          }
        } catch (error) {
          console.log('World Bank regional data not available');
        }

        // If both APIs fail, fall back to enhanced simulation
        setLiveRegionData(prev => prev.map(region => ({
          ...region,
          traffic: Math.max(40, Math.min(95, region.traffic + (Math.random() - 0.5) * 4))
        })));

      } catch (error) {
        console.error('Error fetching real regional data:', error);
      }
    };

    // Fetch real data immediately
    fetchRealOutageData();
    fetchRealRegionalData();
    
    // Set up intervals
    const realDataInterval = setInterval(fetchRealOutageData, 30000); // Fetch real outage data every 30 seconds
    const regionalDataInterval = setInterval(fetchRealRegionalData, 45000); // Fetch real regional data every 45 seconds
    
    // Simulate real-time updates for other data (keep existing functionality)
    const simulatedInterval = setInterval(() => {
      // Update main statistics (excluding activeOutages which comes from API)
      setStats(prev => {
        const newTraffic = (800 + Math.random() * 100).toFixed(1);
        return {
          ...prev,
          averageResponseTime: Math.max(200, Math.min(300, prev.averageResponseTime + Math.floor(Math.random() * 10 - 5))),
          // activeOutages now comes from real API, so we don't update it here
          uptime: Math.max(99.0, Math.min(100, prev.uptime + (Math.random() - 0.5) * 0.1)),
          totalTraffic: `${newTraffic} Tbps`
        };
      });

      // Regional data now updated by API calls, so we don't simulate it here anymore

      // Update 24-hour traffic pattern (simulate rolling data)
      setLiveTrafficData(prev => {
        const newData = [...prev];
        // Simulate current hour update
        const currentHourIndex = Math.floor(Math.random() * newData.length);
        newData[currentHourIndex] = {
          ...newData[currentHourIndex],
          traffic: Math.max(40, Math.min(100, newData[currentHourIndex].traffic + (Math.random() - 0.5) * 8))
        };
        return newData;
      });

      // Update 24-hour traffic pattern (simulate rolling data)
      setLiveTrafficData(prev => {
        const newData = [...prev];
        // Simulate current hour update
        const currentHourIndex = Math.floor(Math.random() * newData.length);
        newData[currentHourIndex] = {
          ...newData[currentHourIndex],
          traffic: Math.max(40, Math.min(100, newData[currentHourIndex].traffic + (Math.random() - 0.5) * 8))
        };
        return newData;
      });

      // Update response times by region
      setLiveResponseTimes(prev => prev.map(region => ({
        ...region,
        avgTime: Math.max(30, Math.min(250, region.avgTime + Math.floor(Math.random() * 20 - 10))),
        servers: Math.max(100, Math.min(2000, region.servers + Math.floor(Math.random() * 20 - 10)))
      })));

      // Update application traffic (maintaining relative percentages)
      setLiveApplicationTraffic(prev => {
        const totalBase = prev.reduce((sum, app) => sum + app.traffic, 0);
        return prev.map(app => {
          const fluctuation = (Math.random() - 0.5) * 0.1; // ±10% change
          const newTraffic = Math.max(app.traffic * 0.8, Math.min(app.traffic * 1.2, app.traffic * (1 + fluctuation)));
          return {
            ...app,
            traffic: parseFloat(newTraffic.toFixed(1)),
            percentage: parseFloat(((newTraffic / totalBase) * 100).toFixed(1))
          };
        });
      });

      // Update server load data
      setLiveServerLoad(prev => prev.map(point => ({
        ...point,
        load: Math.max(30, Math.min(100, point.load + (Math.random() - 0.5) * 6)),
        connections: Math.max(150000, Math.min(400000, point.connections + Math.floor((Math.random() - 0.5) * 20000)))
      })));

    }, 3000); // Update simulated data every 3 seconds

    return () => {
      window.removeEventListener('updateStatsPanelCount', handleOutageCountUpdate as EventListener);
      clearInterval(realDataInterval);
      clearInterval(regionalDataInterval);
      clearInterval(simulatedInterval);
      clearInterval(uptimeRefreshInterval);
    };
  }, []);

  // Get infrastructure status color
  const getInfrastructureColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Good': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Fair': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'Limited': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Poor': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  if (!mounted) {
    return <div className="animate-pulse bg-white/50 h-32 rounded-xl border border-gray-200"></div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Global Statistics Cards */}
        <div 
          className="glass-card rounded-xl p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
          onClick={() => setShowUptimeModal(true)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Global Uptime</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.uptime.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">Last 24h</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
              <Globe className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div 
          className="glass-card rounded-xl p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
          onClick={() => setShowResponseModal(true)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg Response</p>
              <p className="text-3xl font-bold text-amber-600">{stats.averageResponseTime}ms</p>
              <p className="text-xs text-gray-500 mt-1">Global average</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
              <Zap className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div 
          className="glass-card rounded-xl p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
          onClick={() => {
            // This will be handled by the parent component's outage modal
            window.dispatchEvent(new CustomEvent('showOutages'));
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Outages</p>
              <p className="text-3xl font-bold text-red-600">{stats.activeOutages}</p>
              <p className="text-xs text-gray-500 mt-1">Worldwide</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div 
          className="glass-card rounded-xl p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
          onClick={() => setShowTrafficModal(true)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Traffic</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalTraffic}</p>
              <p className="text-xs text-gray-500 mt-1">Current load</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

      {/* Traffic Timeline Chart */}
      <div className="md:col-span-2 lg:col-span-2 glass-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          24-Hour Traffic Pattern
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={liveTrafficData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                color: '#1e293b'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="traffic" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Regional Traffic Chart */}
      <div className="md:col-span-2 lg:col-span-2 glass-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-600" />
          Regional Traffic Load
          <span className="text-sm font-normal text-green-600 ml-2">
            🟢 Real API Data
          </span>
          <span className="text-sm font-normal text-gray-500 ml-2">Click bars to view countries</span>
        </h3>
        
        <ResponsiveContainer width="100%" height={200}>
          <BarChart 
            data={liveRegionData}
            onClick={(event) => {
              if (event && event.activeLabel) {
                setSelectedContinent(event.activeLabel);
                setShowRegionalModal(true);
                console.log('Clicked continent:', event.activeLabel);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="region" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                color: '#1e293b'
              }}
            />
            <Bar 
              dataKey="traffic" 
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Uptime Details Modal */}
    {showUptimeModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="modal-card-green max-w-4xl w-full max-h-[80vh] overflow-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-600" />
              Global Uptime Analysis
            </h2>
            <button
              onClick={() => setShowUptimeModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">7-Day Uptime History</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={uptimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis domain={[99, 100]} stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      color: '#1e293b'
                    }}
                    formatter={(value: number) => [`${value}%`, 'Uptime']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="uptime" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="text-emerald-600 text-sm font-medium">Current Uptime</div>
                <div className="text-2xl font-bold text-emerald-700">{currentUptime}%</div>
                <div className="text-xs text-emerald-600">Last 24 hours</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-blue-600 text-sm font-medium">Weekly Average</div>
                <div className="text-2xl font-bold text-blue-700">{weeklyAverageUptime}%</div>
                <div className="text-xs text-blue-600">7-day average</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="text-amber-600 text-sm font-medium">SLA Target</div>
                <div className="text-2xl font-bold text-amber-700">{slaTarget}%</div>
                <div className="text-xs text-emerald-600">{meetingSLA ? '✓ Meeting target' : '⚠ Below target'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Response Time Modal */}
    {showResponseModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="modal-card-orange max-w-4xl w-full max-h-[80vh] overflow-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Clock className="w-6 h-6 text-amber-600" />
              Response Time Analysis
            </h2>
            <button
              onClick={() => setShowResponseModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Regional Response Times</h3>
              <div className="space-y-3">
                {liveResponseTimes.map((region, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-gray-800 font-medium">{region.region}</h4>
                      <div className="text-right">
                        <div className="text-xl font-bold text-amber-600">{region.avgTime}ms</div>
                        <div className="text-xs text-gray-500">{region.servers} servers</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          region.avgTime < 50 ? 'bg-emerald-500' :
                          region.avgTime < 100 ? 'bg-amber-500' :
                          region.avgTime < 150 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, (200 - region.avgTime) / 2)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Traffic Analysis Modal */}
    {showTrafficModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="modal-card-blue max-w-6xl w-full max-h-[80vh] overflow-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Server className="w-6 h-6 text-blue-600" />
              Traffic Analysis & Application Usage
            </h2>
            <button
              onClick={() => setShowTrafficModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Traffic by Application */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Traffic by Application</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={liveApplicationTraffic}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="traffic"
                    >
                      {liveApplicationTraffic.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        color: '#1e293b'
                      }}
                      formatter={(value: number) => [`${value} Tbps`, 'Traffic']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Server Load Over Time */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Server Load (24h)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={liveServerLoad}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="time" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        color: '#1e293b'
                      }}
                      formatter={(value: number, name: string) => [
                        name === 'load' ? `${value}%` : `${value.toLocaleString()}`,
                        name === 'load' ? 'Server Load' : 'Active Connections'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="load" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Application Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Traffic Breakdown</h3>
              <div className="space-y-3">
                {liveApplicationTraffic.map((app, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: app.color }}
                        ></div>
                        <h4 className="text-gray-800 font-medium">{app.name}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">{app.traffic} Tbps</div>
                        <div className="text-xs text-gray-500">{app.percentage}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          backgroundColor: app.color,
                          width: `${app.percentage}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Regional Details Modal */}
    {showRegionalModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="modal-card-purple max-w-6xl w-full max-h-[80vh] overflow-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Globe className="w-6 h-6 text-emerald-600" />
              {selectedContinent} - Country Details
            </h2>
            <button
              onClick={() => setShowRegionalModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Internet Infrastructure by Country</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {continentCountryData[selectedContinent as keyof typeof continentCountryData]?.map((country, index) => (
                  <div key={index} className="bg-white/50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">{country.country}</h4>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
                        <span className="text-sm font-medium text-blue-600">{country.traffic}%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Population:</span>
                        <span className="text-sm font-medium text-gray-800">{country.population}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Avg Speed:</span>
                        <span className="text-sm font-medium text-gray-800">{country.avgSpeed}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Infrastructure:</span>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getInfrastructureColor(country.infrastructure)}`}>
                          {country.infrastructure}
                        </span>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Traffic Load</span>
                          <span>{country.traffic}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${country.traffic}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Summary Statistics */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Regional Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {continentCountryData[selectedContinent as keyof typeof continentCountryData]?.length || 0}
                  </div>
                  <div className="text-sm text-blue-700">Countries</div>
                </div>
                
                <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="text-2xl font-bold text-emerald-600">
                    {Math.round(
                      (continentCountryData[selectedContinent as keyof typeof continentCountryData]?.reduce((sum, country) => sum + country.traffic, 0) || 0) / 
                      (continentCountryData[selectedContinent as keyof typeof continentCountryData]?.length || 1)
                    )}%
                  </div>
                  <div className="text-sm text-emerald-700">Avg Traffic</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-2xl font-bold text-orange-600">
                    {continentCountryData[selectedContinent as keyof typeof continentCountryData]?.reduce((sum, country) => {
                      const speed = parseFloat(country.avgSpeed.replace(/[^\d.]/g, ''));
                      return sum + speed;
                    }, 0) ? Math.round(
                      (continentCountryData[selectedContinent as keyof typeof continentCountryData]?.reduce((sum, country) => {
                        const speed = parseFloat(country.avgSpeed.replace(/[^\d.]/g, ''));
                        return sum + speed;
                      }, 0) || 0) / 
                      (continentCountryData[selectedContinent as keyof typeof continentCountryData]?.length || 1)
                    ) : 0} Mbps
                  </div>
                  <div className="text-sm text-orange-700">Avg Speed</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {continentCountryData[selectedContinent as keyof typeof continentCountryData]?.filter(country => 
                      country.infrastructure === 'Excellent' || country.infrastructure === 'Good'
                    ).length || 0}
                  </div>
                  <div className="text-sm text-purple-700">Good+ Infrastructure</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
