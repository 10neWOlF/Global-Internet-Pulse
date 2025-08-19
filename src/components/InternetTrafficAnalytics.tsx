'use client';

import React, { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Calendar, BarChart3 } from 'lucide-react';

interface TrafficPattern {
  hour: number;
  traffic: number;
  region: string;
  day: string;
}

interface RegionalTraffic {
  region: string;
  currentTraffic: number;
  peakTraffic: number;
  avgTraffic: number;
  color: string;
}

interface PeakHours {
  region: string;
  morningPeak: string;
  eveningPeak: string;
  offPeakHours: string;
}

const InternetTrafficAnalytics: React.FC = () => {
  const [regionalData, setRegionalData] = useState<RegionalTraffic[]>([]);
  const [peakHours, setPeakHours] = useState<PeakHours[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);

  // Generate realistic traffic patterns based on time zones and usage habits
  const generateTrafficData = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    const regions = ['North America', 'Europe', 'Asia-Pacific', 'Latin America', 'Africa', 'Middle East'];
    const newData: TrafficPattern[] = [];
    
    regions.forEach(region => {
      // Different time zones affect peak hours
      let timeOffset = 0;
      switch (region) {
        case 'North America': timeOffset = -5; break; // EST
        case 'Europe': timeOffset = 1; break; // CET
        case 'Asia-Pacific': timeOffset = 8; break; // CST
        case 'Latin America': timeOffset = -3; break; // BRT
        case 'Africa': timeOffset = 2; break; // CAT
        case 'Middle East': timeOffset = 3; break; // AST
      }
      
      const localHour = (currentHour + timeOffset + 24) % 24;
      
      // Generate traffic based on local time patterns
      let baseTraffic = 50;
      
      // Peak hours: 8-10am and 7-11pm local time
      if ((localHour >= 8 && localHour <= 10) || (localHour >= 19 && localHour <= 23)) {
        baseTraffic = 85 + Math.random() * 15;
      }
      // Work hours: 10am-6pm
      else if (localHour >= 10 && localHour <= 18) {
        baseTraffic = 70 + Math.random() * 15;
      }
      // Late night: 11pm-6am
      else if (localHour >= 23 || localHour <= 6) {
        baseTraffic = 25 + Math.random() * 15;
      }
      // Early morning: 6-8am
      else {
        baseTraffic = 40 + Math.random() * 15;
      }
      
      // Weekend adjustment (higher evening traffic)
      if (currentDay === 'Saturday' || currentDay === 'Sunday') {
        if (localHour >= 19 && localHour <= 24) {
          baseTraffic *= 1.2;
        }
      }
      
      newData.push({
        hour: localHour,
        traffic: Math.round(baseTraffic),
        region,
        day: currentDay
      });
    });
    
    return newData;
  };

  // Generate regional traffic summary
  const generateRegionalData = (data: TrafficPattern[]): RegionalTraffic[] => {
    const regions = ['North America', 'Europe', 'Asia-Pacific', 'Latin America', 'Africa', 'Middle East'];
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
    
    return regions.map((region, index) => {
      const regionData = data.filter(d => d.region === region);
      const currentTraffic = regionData[0]?.traffic || 0;
      
      return {
        region,
        currentTraffic,
        peakTraffic: 95 + Math.random() * 5,
        avgTraffic: 65 + Math.random() * 10,
        color: colors[index]
      };
    });
  };

  // Generate peak hours information
  const generatePeakHours = (): PeakHours[] => {
    return [
      {
        region: 'North America',
        morningPeak: '8:00-10:00 AM EST',
        eveningPeak: '7:00-11:00 PM EST',
        offPeakHours: '2:00-6:00 AM EST'
      },
      {
        region: 'Europe',
        morningPeak: '8:00-10:00 AM CET',
        eveningPeak: '7:00-11:00 PM CET',
        offPeakHours: '2:00-6:00 AM CET'
      },
      {
        region: 'Asia-Pacific',
        morningPeak: '8:00-10:00 AM CST',
        eveningPeak: '7:00-11:00 PM CST',
        offPeakHours: '2:00-6:00 AM CST'
      },
      {
        region: 'Latin America',
        morningPeak: '8:00-10:00 AM BRT',
        eveningPeak: '7:00-11:00 PM BRT',
        offPeakHours: '2:00-6:00 AM BRT'
      }
    ];
  };

  // Generate 24-hour traffic pattern for selected region
  const generate24HourPattern = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return hours.map(hour => {
      let traffic = 50;
      
      // Peak patterns
      if ((hour >= 8 && hour <= 10) || (hour >= 19 && hour <= 23)) {
        traffic = 80 + Math.random() * 15;
      } else if (hour >= 10 && hour <= 18) {
        traffic = 65 + Math.random() * 10;
      } else if (hour >= 23 || hour <= 6) {
        traffic = 25 + Math.random() * 10;
      } else {
        traffic = 40 + Math.random() * 10;
      }
      
      return {
        hour: `${hour.toString().padStart(2, '0')}:00`,
        traffic: Math.round(traffic),
        region: 'Global'
      };
    });
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const updateData = () => {
      const newTrafficData = generateTrafficData();
      setRegionalData(generateRegionalData(newTrafficData));
      setPeakHours(generatePeakHours());
      setLastUpdated(new Date());
    };

    updateData();
    
    // Update every minute to show real-time traffic changes
    const interval = setInterval(updateData, 60000);

    return () => clearInterval(interval);
  }, []);

  const hourlyPattern = generate24HourPattern();
  const globalTraffic = regionalData.reduce((sum, region) => sum + region.currentTraffic, 0) / regionalData.length;

  return (
    <div className="space-y-6">
      {/* Global Traffic Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Global Traffic</p>
              <p className="text-xl font-bold text-blue-900">{globalTraffic.toFixed(0)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Peak Load</p>
              <p className="text-xl font-bold text-green-900">
                {Math.max(...regionalData.map(r => r.currentTraffic)).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Active Regions</p>
              <p className="text-xl font-bold text-purple-900">
                {regionalData.filter(r => r.currentTraffic > 60).length}/6
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-orange-600 font-medium">Time Zone</p>
              <p className="text-xl font-bold text-orange-900">
                {isMounted ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 24-Hour Traffic Pattern */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">24-Hour Global Traffic Pattern</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live • Updated {isMounted ? lastUpdated.toLocaleTimeString() : '--:--:--'}
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={hourlyPattern}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="hour" 
              stroke="#666"
              fontSize={12}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number) => [`${value}%`, 'Traffic Load']}
            />
            <Area
              type="monotone"
              dataKey="traffic"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Regional Traffic and Peak Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Traffic Levels */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Regional Traffic</h3>
          <div className="space-y-4">
            {regionalData.map((region) => (
              <div key={region.region} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{region.region}</span>
                  <span className="font-semibold" style={{ color: region.color }}>
                    {region.currentTraffic.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full">
                  <div 
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${region.currentTraffic}%`,
                      backgroundColor: region.color
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Avg: {region.avgTraffic.toFixed(0)}%</span>
                  <span>Peak: {region.peakTraffic.toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours Information */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Peak Hours</h3>
          <div className="space-y-4">
            {peakHours.map((peak) => (
              <div key={peak.region} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">{peak.region}</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Morning Peak:</span> {peak.morningPeak}</p>
                  <p><span className="font-medium">Evening Peak:</span> {peak.eveningPeak}</p>
                  <p><span className="font-medium">Off-Peak:</span> {peak.offPeakHours}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic Insights */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Current Global Trend</h4>
            <p className="text-sm text-blue-800">
              {globalTraffic > 70 ? 
                "High traffic period - Multiple regions experiencing peak usage" :
                globalTraffic > 50 ?
                "Moderate traffic - Standard usage patterns across regions" :
                "Low traffic period - Off-peak hours in most regions"
              }
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Network Performance</h4>
            <p className="text-sm text-green-800">
              {regionalData.filter(r => r.currentTraffic > 85).length === 0 ?
                "All regions operating within normal capacity" :
                `${regionalData.filter(r => r.currentTraffic > 85).length} region(s) experiencing high load`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternetTrafficAnalytics;
