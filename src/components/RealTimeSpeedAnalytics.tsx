'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wifi, Activity, Globe } from 'lucide-react';

interface SpeedData {
  timestamp: string;
  avgDownload: number;
  avgUpload: number;
  avgPing: number;
  region: string;
}

interface GlobalSpeedStats {
  globalAvgDownload: number;
  globalAvgUpload: number;
  globalAvgPing: number;
  topCountries: {
    country: string;
    avgSpeed: number;
    flag: string;
  }[];
  slowestCountries: {
    country: string;
    avgSpeed: number;
    flag: string;
  }[];
}

const RealTimeSpeedAnalytics: React.FC = () => {
  const [speedData, setSpeedData] = useState<SpeedData[]>([]);
  const [globalStats, setGlobalStats] = useState<GlobalSpeedStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);

  // Generate realistic speed data based on time of day and region
  const generateSpeedData = () => {
    const now = new Date();
    const hour = now.getHours();
    
    // Simulate peak hours (slower speeds during 7-9am and 7-10pm)
    const isPeakHour = (hour >= 7 && hour <= 9) || (hour >= 19 && hour <= 22);
    const baseSpeedMultiplier = isPeakHour ? 0.7 : 1.0;
    
    const regions = ['North America', 'Europe', 'Asia-Pacific', 'Latin America'];
    const newData: SpeedData[] = [];
    
    regions.forEach(region => {
      // Different base speeds for different regions
      let baseDownload = 50;
      let baseUpload = 25;
      let basePing = 20;
      
      switch (region) {
        case 'North America':
          baseDownload = 120;
          baseUpload = 40;
          basePing = 15;
          break;
        case 'Europe':
          baseDownload = 85;
          baseUpload = 35;
          basePing = 18;
          break;
        case 'Asia-Pacific':
          baseDownload = 75;
          baseUpload = 30;
          basePing = 25;
          break;
        case 'Latin America':
          baseDownload = 45;
          baseUpload = 20;
          basePing = 35;
          break;
      }
      
      newData.push({
        timestamp: now.toISOString(),
        avgDownload: Math.round((baseDownload * baseSpeedMultiplier + Math.random() * 20 - 10) * 10) / 10,
        avgUpload: Math.round((baseUpload * baseSpeedMultiplier + Math.random() * 10 - 5) * 10) / 10,
        avgPing: Math.round((basePing + Math.random() * 10 - 5) * 10) / 10,
        region
      });
    });
    
    return newData;
  };

  // Generate global statistics
  const generateGlobalStats = (data: SpeedData[]): GlobalSpeedStats => {
    const totalDownload = data.reduce((sum, item) => sum + item.avgDownload, 0);
    const totalUpload = data.reduce((sum, item) => sum + item.avgUpload, 0);
    const totalPing = data.reduce((sum, item) => sum + item.avgPing, 0);
    
    return {
      globalAvgDownload: Math.round((totalDownload / data.length) * 10) / 10,
      globalAvgUpload: Math.round((totalUpload / data.length) * 10) / 10,
      globalAvgPing: Math.round((totalPing / data.length) * 10) / 10,
      topCountries: [
        { country: 'South Korea', avgSpeed: 134.7, flag: '🇰🇷' },
        { country: 'Singapore', avgSpeed: 132.1, flag: '🇸🇬' },
        { country: 'Hong Kong', avgSpeed: 127.3, flag: '🇭🇰' },
        { country: 'Romania', avgSpeed: 119.8, flag: '🇷🇴' },
        { country: 'Switzerland', avgSpeed: 117.4, flag: '🇨🇭' },
      ],
      slowestCountries: [
        { country: 'Afghanistan', avgSpeed: 3.2, flag: '🇦🇫' },
        { country: 'Yemen', avgSpeed: 3.8, flag: '🇾🇪' },
        { country: 'Syria', avgSpeed: 4.1, flag: '🇸🇾' },
        { country: 'Chad', avgSpeed: 4.7, flag: '🇹🇩' },
        { country: 'Niger', avgSpeed: 5.1, flag: '🇳🇪' },
      ]
    };
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const updateData = () => {
      const newData = generateSpeedData();
      setSpeedData(prev => {
        const updated = [...prev, ...newData].slice(-40); // Keep last 40 data points
        return updated;
      });
      setGlobalStats(generateGlobalStats(newData));
      setLastUpdated(new Date());
      setIsLoading(false);
    };

    // Initial load
    updateData();

    // Update every 30 seconds
    const interval = setInterval(updateData, 30000);

    return () => clearInterval(interval);
  }, []);

  const getLatestRegionalData = () => {
    if (speedData.length === 0) return [];
    
    const latest = speedData.slice(-4); // Last 4 entries (one per region)
    return latest;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Global Speed Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Global Avg Download</p>
              <p className="text-xl font-bold text-blue-900">{globalStats?.globalAvgDownload || 0} Mbps</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Global Avg Upload</p>
              <p className="text-xl font-bold text-green-900">{globalStats?.globalAvgUpload || 0} Mbps</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Wifi className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-orange-600 font-medium">Global Avg Ping</p>
              <p className="text-xl font-bold text-orange-900">{globalStats?.globalAvgPing || 0} ms</p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Speed Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Real-time Regional Speeds</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live • Updated {isMounted ? lastUpdated.toLocaleTimeString() : '--:--:--'}
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getLatestRegionalData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="region" 
              stroke="#666"
              fontSize={12}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number, name: string) => [
                `${value} ${name.includes('Ping') ? 'ms' : 'Mbps'}`, 
                name.replace('avg', '').replace(/([A-Z])/g, ' $1').trim()
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="avgDownload" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="avgDownload"
            />
            <Line 
              type="monotone" 
              dataKey="avgUpload" 
              stroke="#10b981" 
              strokeWidth={2}
              name="avgUpload"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Speed Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fastest Countries */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-500" />
            Fastest Countries
          </h3>
          <div className="space-y-3">
            {globalStats?.topCountries.map((country, index) => (
              <div key={country.country} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <span className="text-lg">{country.flag}</span>
                  <span className="font-medium text-gray-900">{country.country}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{country.avgSpeed} Mbps</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slowest Countries */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-red-500" />
            Countries Needing Infrastructure
          </h3>
          <div className="space-y-3">
            {globalStats?.slowestCountries.map((country, index) => (
              <div key={country.country} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <span className="text-lg">{country.flag}</span>
                  <span className="font-medium text-gray-900">{country.country}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">{country.avgSpeed} Mbps</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeSpeedAnalytics;
