'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Globe, Smartphone, Wifi, AlertTriangle } from 'lucide-react';
import RealTimeSpeedAnalytics from './RealTimeSpeedAnalytics';
import TechnologyAdoptionTracker from './TechnologyAdoptionTracker';
import InternetTrafficAnalytics from './InternetTrafficAnalytics';

interface TrendData {
  year: number;
  internetUsers: number;
  penetrationRate: number;
  population: number;
  mobileUsers: number;
}

interface CountryPenetration {
  country: string;
  penetration: number;
  users: number;
  flag: string;
}

interface RegionalData {
  region: string;
  users: number;
  penetration: number;
  color: string;
}

const GlobalTrends: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLiveData, setIsLiveData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);

  // Dynamic trend data - will be populated from API
  const [trendData, setTrendData] = useState<TrendData[]>([]);

  // Dynamic country penetration data
  const [topCountries, setTopCountries] = useState<CountryPenetration[]>([]);

  // Dynamic regional distribution data
  const [regionalData, setRegionalData] = useState<RegionalData[]>([]);

  // Dynamic current statistics
  const [currentStats, setCurrentStats] = useState({
    globalPenetration: 0,
    totalUsers: 0,
    growthRate: 0,
    mobileFirst: 0,
    ruralCoverage: 0,
    genderGap: 0,
    economicImpact: 0,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch real data from API
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const response = await fetch('/api/worldbank');
        const data = await response.json();
        
        if (data.source === 'World Bank API') {
          setIsLiveData(true);
          setTrendData(data.globalTrends || []);
          setTopCountries(data.topCountries || []);
          setRegionalData(data.regionalData || []);
          setCurrentStats({
            globalPenetration: data.currentStats?.globalPenetration || 0,
            totalUsers: data.currentStats?.totalUsers || 0,
            growthRate: data.currentStats?.growthRate || 0,
            mobileFirst: data.currentStats?.mobileFirst || 0,
            ruralCoverage: data.currentStats?.ruralCoverage || 0,
            genderGap: data.currentStats?.genderGap || 0,
            economicImpact: data.currentStats?.economicImpact || 0,
          });
        }
        setLastUpdated(new Date());
      } catch {
        console.log('API unavailable, using fallback data');
        setIsLiveData(false);
      }
    };

    fetchRealData();
    const interval = setInterval(fetchRealData, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const getFilteredData = () => {
    return trendData; // Return all available data
  };

  const OverviewTab = () => (
    <>
      {/* Show loading state if no data available */}
      {trendData.length === 0 && topCountries.length === 0 && regionalData.length === 0 ? (
        <div className="text-center py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading global internet trends data...</p>
        </div>
      ) : (
        <>
          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Global Internet Users</p>
                  <p className="text-2xl font-bold text-blue-900">{currentStats.globalPenetration}%</p>
                </div>
              </div>
              <p className="text-sm text-blue-700">of world population</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Total Users</p>
                  <p className="text-2xl font-bold text-green-900">{currentStats.totalUsers}B</p>
                </div>
              </div>
              <p className="text-sm text-green-700">worldwide</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium">Growth Rate</p>
                  <p className="text-2xl font-bold text-purple-900">+{currentStats.growthRate}%</p>
                </div>
              </div>
              <p className="text-sm text-purple-700">year over year</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Internet Penetration Over Time */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Global Internet Penetration Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getFilteredData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="year" 
                    stroke="#666"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                    domain={[0, 80]}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`${value}%`, 'Penetration Rate']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="penetrationRate" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Internet Users vs Population Growth */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Internet Users vs Population Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getFilteredData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="year" 
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
                      `${value}M`, 
                      name === 'internetUsers' ? 'Internet Users' : 'Population'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="internetUsers" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="internetUsers"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="population" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    name="population"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Top Countries */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries by Internet Penetration</h3>
              <div className="space-y-3">
                {topCountries.slice(0, 6).map((country) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{country.flag}</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{country.country}</p>
                        <p className="text-xs text-gray-500">{country.users}M users</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">{country.penetration}%</p>
                      <div className="w-16 h-1 bg-gray-200 rounded-full mt-1">
                        <div 
                          className="h-1 bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${(country.penetration / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Distribution */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={regionalData}
                    dataKey="users"
                    nameKey="region"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ region, penetration }) => `${region.split('-')[0]} ${penetration}%`}
                    labelLine={false}
                    fontSize={10}
                  >
                    {regionalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string) => [`${value}M users`, name]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Dynamic Insights */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Insights</h3>
              <div className="space-y-4">
                {currentStats.mobileFirst > 0 && (
                  <div className="flex items-start gap-3">
                    <Smartphone className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Mobile-first adoption</p>
                      <p className="text-xs text-gray-600">Over {currentStats.mobileFirst}% of internet users in developing countries access the web primarily through mobile devices.</p>
                    </div>
                  </div>
                )}
                
                {currentStats.ruralCoverage > 0 && (
                  <div className="flex items-start gap-3">
                    <Wifi className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Infrastructure gap</p>
                      <p className="text-xs text-gray-600">Rural areas still face significant connectivity challenges, with only {currentStats.ruralCoverage}% coverage globally.</p>
                    </div>
                  </div>
                )}
                
                {currentStats.economicImpact > 0 && (
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Economic impact</p>
                      <p className="text-xs text-gray-600">Countries with higher internet penetration show {currentStats.economicImpact}x faster GDP growth on average.</p>
                    </div>
                  </div>
                )}
                
                {currentStats.genderGap > 0 && (
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Gender gap</p>
                      <p className="text-xs text-gray-600">Women are {currentStats.genderGap}% less likely to have internet access compared to men globally.</p>
                    </div>
                  </div>
                )}

                {currentStats.globalPenetration === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">Loading insights from live data...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  return (
    <div className="glass-card rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Global Internet Trends</h2>
          <p className="text-gray-600">Real-time analysis and insights</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isLiveData ? 'bg-green-500' : 'bg-orange-500'}`}></div>
            <span className="text-gray-600">
              {isLiveData ? 'Live Data' : 'Enhanced Data'} • Updated {isMounted ? lastUpdated.toLocaleTimeString() : '--:--:--'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: Globe },
          { id: 'speed', label: 'Speed Analytics', icon: TrendingUp },
          { id: 'technology', label: 'Technology', icon: Smartphone },
          { id: 'traffic', label: 'Traffic Patterns', icon: Wifi }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'speed' && <RealTimeSpeedAnalytics />}
      {activeTab === 'technology' && <TechnologyAdoptionTracker />}
      {activeTab === 'traffic' && <InternetTrafficAnalytics />}
    </div>
  );
};

export default GlobalTrends;