'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Wifi, Smartphone, Monitor, TrendingUp, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SpeedData {
  rank: number;
  country: string;
  countryCode: string;
  continent: string;
  mobileSpeed: number;
  broadbandSpeed: number;
  lastUpdated: string;
}

interface SpeedRankingsData {
  data: SpeedData[];
  lastUpdated: string;
  source: string;
  totalCountries: number;
  continents: string[];
  metadata: {
    updateFrequency: string;
    nextUpdate: string;
    dataPoints: number;
  };
}

export default function InternetSpeedRankings() {
  const [speedData, setSpeedData] = useState<SpeedRankingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [sortField, setSortField] = useState<'rank' | 'mobileSpeed' | 'broadbandSpeed'>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchSpeedData();
  }, []);

  const fetchSpeedData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/internet-speeds');
      if (!response.ok) {
        throw new Error('Failed to fetch speed data');
      }
      const data = await response.json();
      setSpeedData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedData = useMemo(() => {
    if (!speedData) return [];

    const filtered = speedData.data.filter(item => {
      const matchesSearch = item.country.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesContinent = selectedContinent === 'All' || item.continent === selectedContinent;
      return matchesSearch && matchesContinent;
    });

    // Sort data
    filtered.sort((a, b) => {
      let aValue: number, bValue: number;
      
      switch (sortField) {
        case 'mobileSpeed':
          aValue = a.mobileSpeed;
          bValue = b.mobileSpeed;
          break;
        case 'broadbandSpeed':
          aValue = a.broadbandSpeed;
          bValue = b.broadbandSpeed;
          break;
        default:
          aValue = a.rank;
          bValue = b.rank;
      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [speedData, searchTerm, selectedContinent, sortField, sortDirection]);

  const chartData = useMemo(() => {
    return filteredAndSortedData.slice(0, 10).map(item => ({
      country: item.country.length > 10 ? item.country.substring(0, 10) + '...' : item.country,
      mobile: item.mobileSpeed,
      broadband: item.broadbandSpeed,
      fullName: item.country
    }));
  }, [filteredAndSortedData]);

  const handleSort = (field: 'rank' | 'mobileSpeed' | 'broadbandSpeed') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSpeedBadge = (speed: number, type: 'mobile' | 'broadband'): string => {
    const threshold = type === 'mobile' ? 80 : 150;
    if (speed >= threshold) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (speed >= threshold * 0.7) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-xl border-red-200 p-6">
        <div className="flex items-center gap-2 text-red-600 mb-2">
          <Wifi className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Speed Rankings Unavailable</h3>
        </div>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchSpeedData}
          className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!speedData) return null;

  return (
    <div className="glass-card rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Wifi className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Global Internet Speed Rankings</h2>
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {speedData.totalCountries} countries
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'table' 
                ? 'bg-blue-100 text-blue-600 border border-blue-200' 
                : 'bg-gray-100 text-gray-600 hover:text-gray-800'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('chart')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'chart' 
                ? 'bg-blue-100 text-blue-600 border border-blue-200' 
                : 'bg-gray-100 text-gray-600 hover:text-gray-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select
          value={selectedContinent}
          onChange={(e) => setSelectedContinent(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="All">All Continents</option>
          {speedData.continents.map(continent => (
            <option key={continent} value={continent}>{continent}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th 
                  className="text-left py-3 px-4 text-gray-600 font-medium cursor-pointer hover:text-gray-800 transition-colors"
                  onClick={() => handleSort('rank')}
                >
                  <div className="flex items-center gap-2">
                    Rank
                    {sortField === 'rank' && (
                      <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Country</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Continent</th>
                <th 
                  className="text-right py-3 px-4 text-gray-600 font-medium cursor-pointer hover:text-gray-800 transition-colors"
                  onClick={() => handleSort('mobileSpeed')}
                >
                  <div className="flex items-center justify-end gap-2">
                    <Smartphone className="w-4 h-4" />
                    Mobile (Mbps)
                    {sortField === 'mobileSpeed' && (
                      <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="text-right py-3 px-4 text-gray-600 font-medium cursor-pointer hover:text-gray-800 transition-colors"
                  onClick={() => handleSort('broadbandSpeed')}
                >
                  <div className="flex items-center justify-end gap-2">
                    <Monitor className="w-4 h-4" />
                    Broadband (Mbps)
                    {sortField === 'broadbandSpeed' && (
                      <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedData.map((country, index) => (
                <tr 
                  key={country.countryCode} 
                  className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                    index < 3 ? 'bg-amber-50' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold ${
                        country.rank === 1 ? 'text-amber-600' :
                        country.rank === 2 ? 'text-gray-600' :
                        country.rank === 3 ? 'text-orange-600' : 'text-gray-800'
                      }`}>
                        #{country.rank}
                      </span>
                      {country.rank <= 3 && (
                        <span className="text-lg">
                          {country.rank === 1 ? '🥇' : country.rank === 2 ? '🥈' : '🥉'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-4 rounded bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        {country.countryCode}
                      </div>
                      <span className="text-gray-800 font-medium">{country.country}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-600">{country.continent}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded border ${getSpeedBadge(country.mobileSpeed, 'mobile')}`}>
                      <span className="font-mono font-bold">{country.mobileSpeed}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded border ${getSpeedBadge(country.broadbandSpeed, 'broadband')}`}>
                      <span className="font-mono font-bold">{country.broadbandSpeed}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-96">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Top 10 Countries - Speed Comparison
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="country" 
                stroke="#64748b"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#374151',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [
                  `${value} Mbps`,
                  name === 'mobile' ? 'Mobile Speed' : 'Broadband Speed'
                ]}
                labelFormatter={(label) => {
                  const item = chartData.find(d => d.country === label);
                  return item?.fullName || label;
                }}
              />
              <Legend 
                wrapperStyle={{ color: '#64748b' }}
                iconType="rect"
              />
              <Bar 
                dataKey="mobile" 
                fill="#3B82F6" 
                name="mobile"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="broadband" 
                fill="#10B981" 
                name="broadband"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Countries Ranked</span>
          </div>
          <div className="text-xl font-bold text-blue-600">{filteredAndSortedData.length}</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Monitor className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Avg Broadband</span>
          </div>
          <div className="text-xl font-bold text-green-600">
            {(filteredAndSortedData.reduce((sum, item) => sum + item.broadbandSpeed, 0) / filteredAndSortedData.length).toFixed(1)} Mbps
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">Avg Mobile</span>
          </div>
          <div className="text-xl font-bold text-purple-600">
            {(filteredAndSortedData.reduce((sum, item) => sum + item.mobileSpeed, 0) / filteredAndSortedData.length).toFixed(1)} Mbps
          </div>
        </div>
        
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-gray-600">Top Speed</span>
          </div>
          <div className="text-xl font-bold text-amber-600">
            {Math.max(...filteredAndSortedData.map(item => item.broadbandSpeed)).toFixed(1)} Mbps
          </div>
        </div>
      </div>

      {/* Attribution */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-gray-600 text-sm">
          <span className="font-medium">Source:</span> {speedData.source} • 
          <span className="font-medium"> Last Updated:</span> {new Date(speedData.lastUpdated).toLocaleDateString()} • 
          <span className="font-medium"> Update Frequency:</span> {speedData.metadata.updateFrequency}
        </p>
        <p className="text-gray-500 text-xs mt-1">
          Next update: {new Date(speedData.metadata.nextUpdate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
