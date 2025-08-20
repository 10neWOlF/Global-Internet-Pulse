'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Smartphone, Wifi, Router, Satellite } from 'lucide-react';

interface TechAdoption {
  technology: string;
  globalAdoption: number;
  yearOverYearGrowth: number;
  projectedGrowth: number;
  color: string;
  icon: React.ReactNode;
}

interface CountryTechData {
  country: string;
  flag: string;
  fiveG: number;
  fiber: number;
  ipv6: number;
  satellite: number;
}

const TechnologyAdoptionTracker: React.FC = () => {
  const [techData, setTechData] = useState<TechAdoption[]>([]);
  const [countryData, setCountryData] = useState<CountryTechData[]>([]);
  const [selectedTech, setSelectedTech] = useState<string>('5G');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);

  // Generate realistic technology adoption data
  const generateTechData = (): TechAdoption[] => {
    const currentMonth = new Date().getMonth() + 1;
    
    // Simulate monthly growth in adoption rates
    const baseGrowth = currentMonth / 12; // Progress through the year
    
    return [
      {
        technology: '5G',
        globalAdoption: 28.5 + baseGrowth * 5, // Growing throughout 2025
        yearOverYearGrowth: 245.7,
        projectedGrowth: 180.2,
        color: '#3b82f6',
        icon: <Smartphone className="w-5 h-5" />
      },
      {
        technology: 'Fiber Optic',
        globalAdoption: 42.1 + baseGrowth * 3,
        yearOverYearGrowth: 18.3,
        projectedGrowth: 25.4,
        color: '#10b981',
        icon: <Wifi className="w-5 h-5" />
      },
      {
        technology: 'IPv6',
        globalAdoption: 37.8 + baseGrowth * 2,
        yearOverYearGrowth: 12.1,
        projectedGrowth: 15.7,
        color: '#8b5cf6',
        icon: <Router className="w-5 h-5" />
      },
      {
        technology: 'Satellite Internet',
        globalAdoption: 8.2 + baseGrowth * 1.5,
        yearOverYearGrowth: 89.4,
        projectedGrowth: 145.8,
        color: '#f59e0b',
        icon: <Satellite className="w-5 h-5" />
      }
    ];
  };

  // Generate country-specific technology data
  const generateCountryData = (): CountryTechData[] => {
    return [
      {
        country: 'South Korea',
        flag: '🇰🇷',
        fiveG: 85.2,
        fiber: 94.1,
        ipv6: 78.3,
        satellite: 2.1
      },
      {
        country: 'Singapore',
        flag: '🇸🇬',
        fiveG: 82.7,
        fiber: 89.5,
        ipv6: 81.2,
        satellite: 3.4
      },
      {
        country: 'United States',
        flag: '🇺🇸',
        fiveG: 76.3,
        fiber: 67.8,
        ipv6: 45.2,
        satellite: 12.7
      },
      {
        country: 'China',
        flag: '🇨🇳',
        fiveG: 74.1,
        fiber: 82.3,
        ipv6: 52.6,
        satellite: 5.8
      },
      {
        country: 'Japan',
        flag: '🇯🇵',
        fiveG: 71.9,
        fiber: 87.2,
        ipv6: 68.9,
        satellite: 4.2
      },
      {
        country: 'Germany',
        flag: '🇩🇪',
        fiveG: 68.4,
        fiber: 71.3,
        ipv6: 58.7,
        satellite: 7.1
      },
      {
        country: 'United Kingdom',
        flag: '🇬🇧',
        fiveG: 65.8,
        fiber: 64.2,
        ipv6: 49.8,
        satellite: 8.9
      },
      {
        country: 'France',
        flag: '🇫🇷',
        fiveG: 62.1,
        fiber: 69.7,
        ipv6: 46.3,
        satellite: 6.8
      }
    ];
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const updateData = () => {
      setTechData(generateTechData());
      setCountryData(generateCountryData());
      setLastUpdated(new Date());
    };

    updateData();
    
    // Update every 2 minutes to simulate real-time tracking
    const interval = setInterval(updateData, 120000);

    return () => clearInterval(interval);
  }, []);

  const getSelectedTechData = () => {
    // Map selected technology to the corresponding property
    const techMapping: { [key: string]: keyof Omit<CountryTechData, 'country' | 'flag'> } = {
      '5G': 'fiveG',
      'Fiber Optic': 'fiber',
      'IPv6': 'ipv6',
      'Satellite': 'satellite'
    };
    
    const techKey = techMapping[selectedTech];
    
    return countryData.map(country => ({
      country: country.country,
      flag: country.flag,
      adoption: techKey ? country[techKey] as number : 0
    })).sort((a, b) => b.adoption - a.adoption);
  };

  return (
    <div className="space-y-6">
      {/* Technology Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {techData.map((tech) => (
          <div
            key={tech.technology}
            className={`bg-white rounded-xl p-4 border-2 cursor-pointer transition-all ${
              selectedTech === tech.technology
                ? 'border-blue-500 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedTech(tech.technology)}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: tech.color + '20' }}>
                <div style={{ color: tech.color }}>
                  {tech.icon}
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-900">{tech.technology}</p>
                <p className="text-sm text-gray-600">Global Adoption</p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-2xl font-bold" style={{ color: tech.color }}>
                  {tech.globalAdoption.toFixed(1)}%
                </p>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-green-600">
                  YoY: +{tech.yearOverYearGrowth.toFixed(1)}%
                </span>
                <span className="text-blue-600">
                  Proj: +{tech.projectedGrowth.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Global Technology Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Global Technology Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={techData}
                dataKey="globalAdoption"
                nameKey="technology"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ technology, globalAdoption }) => `${technology}: ${globalAdoption.toFixed(1)}%`}
                labelLine={false}
                fontSize={11}
              >
                {techData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Adoption Rate']}
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

        {/* Growth Comparison */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Year-over-Year Growth Rates</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={techData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#666" fontSize={12} />
              <YAxis 
                type="category" 
                dataKey="technology" 
                stroke="#666" 
                fontSize={12}
                width={80}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [`+${value.toFixed(1)}%`, 'YoY Growth']}
              />
              <Bar 
                dataKey="yearOverYearGrowth" 
                fill="#3b82f6"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Country Rankings for Selected Technology */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedTech} Adoption by Country
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Live • Updated {isMounted ? lastUpdated.toLocaleTimeString() : '--:--:--'}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getSelectedTechData().map((country, index) => (
            <div key={country.country} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                <span className="text-xl">{country.flag}</span>
                <span className="font-medium text-gray-900">{country.country}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${country.adoption}%` }}
                  />
                </div>
                <span className="font-semibold text-blue-600 w-12 text-right">
                  {country.adoption.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Timeline */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Technology Deployment Timeline 2025-2030</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">5G Coverage Expansion</p>
              <p className="text-sm text-gray-600">Expected to reach 60% global coverage by end of 2025, 85% by 2027</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">Fiber Network Buildout</p>
              <p className="text-sm text-gray-600">Major infrastructure investments targeting 70% fiber coverage globally by 2028</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">Satellite Internet Boom</p>
              <p className="text-sm text-gray-600">LEO constellations expected to provide global coverage by 2026, reaching 25% adoption by 2030</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">IPv6 Migration</p>
              <p className="text-sm text-gray-600">Critical infrastructure transition accelerating, targeting 80% adoption by 2029</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnologyAdoptionTracker;
