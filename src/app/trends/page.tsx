'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users } from 'lucide-react';

interface TrendData {
  globalTrends: { year: number; internetUsers: number }[];
  topCountries: { countryCode: string; countryName: string; latestValue: number }[];
  populationData: { year: number; population: number; internetUsers: number }[];
}

const COLORS = ['#3b82f6', '#1d4ed8', '#1e40af', '#1e3a8a', '#172554'];

export default function TrendsPage() {
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendData();
  }, []);

  const fetchTrendData = async () => {
    try {
      const response = await fetch('/api/worldbank');
      const data = await response.json();
      
      // Generate mock population data for comparison
      const populationData = data.globalTrends.map((trend: { year: number; internetUsers: number }) => ({
        year: trend.year,
        population: 7800 + (trend.year - 2015) * 75, // Mock world population in millions
        internetUsers: trend.internetUsers,
      }));

      setTrendData({
        globalTrends: data.globalTrends,
        topCountries: data.topCountries.slice(0, 10),
        populationData,
      });
    } catch (error) {
      console.error('Failed to fetch trend data:', error);
      // Set fallback data
      setTrendData({
        globalTrends: generateMockTrends(),
        topCountries: generateMockCountries(),
        populationData: generateMockPopulation(),
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative flex items-center justify-center">
        <div className="text-gray-700 text-xl">Loading trends data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            Global Internet Trends
          </h1>
          <p className="text-gray-600">Historical analysis and future projections</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Global Internet Users</p>
                <p className="text-3xl font-bold text-blue-600">64.4%</p>
                <p className="text-xs text-gray-500 mt-1">of world population</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-green-600">5.1B</p>
                <p className="text-xs text-gray-500 mt-1">worldwide</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Growth Rate</p>
                <p className="text-3xl font-bold text-amber-600">+3.7%</p>
                <p className="text-xs text-gray-500 mt-1">year over year</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Global Internet Penetration Trends */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Global Internet Penetration Over Time</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData?.globalTrends || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#374151',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Internet Users']}
              />
              <Line 
                type="monotone" 
                dataKey="internetUsers" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Internet vs Population Growth */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Internet Users vs Population Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData?.populationData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#374151',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="internetUsers" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Internet Users (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="population" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Population (Billions)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Countries by Internet Penetration */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Top Countries by Internet Penetration</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData?.topCountries || []} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis type="category" dataKey="countryName" stroke="#64748b" width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#374151',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Internet Users']}
                />
                <Bar 
                  dataKey="latestValue" 
                  fill="#3b82f6"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Digital Divide Analysis */}
        <div className="mt-8 glass-card rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Digital Divide Analysis</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Regional Distribution</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Asia-Pacific', value: 42, color: COLORS[0] },
                      { name: 'Europe', value: 28, color: COLORS[1] },
                      { name: 'North America', value: 18, color: COLORS[2] },
                      { name: 'Latin America', value: 8, color: COLORS[3] },
                      { name: 'Africa & Middle East', value: 4, color: COLORS[4] },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[0, 1, 2, 3, 4].map((index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      color: '#374151',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`${value}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Key Insights</h4>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-gray-600 text-sm">
                    <strong className="text-gray-800">Mobile-first adoption:</strong> Over 60% of internet users in developing countries access the web primarily through mobile devices.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-gray-600 text-sm">
                    <strong className="text-gray-800">Infrastructure gap:</strong> Rural areas still face significant connectivity challenges, with only 37% coverage globally.
                  </p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <p className="text-gray-600 text-sm">
                    <strong className="text-gray-800">Economic impact:</strong> Countries with higher internet penetration show 1.3x faster GDP growth on average.
                  </p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="text-gray-600 text-sm">
                    <strong className="text-gray-800">Gender gap:</strong> Women are 12% less likely to have internet access compared to men globally.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fallback data generators
function generateMockTrends() {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 10 }, (_, i) => ({
    year: currentYear - 9 + i,
    internetUsers: 45 + (i * 3.5) + Math.random() * 2,
  }));
}

function generateMockCountries() {
  return [
    { countryCode: 'IS', countryName: 'Iceland', latestValue: 99.01 },
    { countryCode: 'NO', countryName: 'Norway', latestValue: 98.54 },
    { countryCode: 'DK', countryName: 'Denmark', latestValue: 98.35 },
    { countryCode: 'LU', countryName: 'Luxembourg', latestValue: 98.12 },
    { countryCode: 'SE', countryName: 'Sweden', latestValue: 97.89 },
    { countryCode: 'NL', countryName: 'Netherlands', latestValue: 97.45 },
    { countryCode: 'CH', countryName: 'Switzerland', latestValue: 96.98 },
    { countryCode: 'FI', countryName: 'Finland', latestValue: 96.54 },
    { countryCode: 'DE', countryName: 'Germany', latestValue: 96.23 },
    { countryCode: 'GB', countryName: 'United Kingdom', latestValue: 95.87 },
  ];
}

function generateMockPopulation() {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 10 }, (_, i) => ({
    year: currentYear - 9 + i,
    population: 7.8 + (i * 0.075),
    internetUsers: 45 + (i * 3.5),
  }));
}
