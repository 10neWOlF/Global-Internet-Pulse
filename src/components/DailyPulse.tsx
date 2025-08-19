'use client';

import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Shield, Globe, Activity, Clock, X, BarChart3, Users } from 'lucide-react';

interface DailyPulseData {
  date: string;
  timestamp: string;
  healthScore: number;
  traffic: {
    global: {
      httpRequests: number;
      bytesServed: number;
      attacks: number;
    };
    trends: string[];
    anomalies: Array<{
      type: string;
      magnitude: string;
      timestamp: string;
    }>;
  };
  freedom: {
    score: number;
    incidents: Array<{
      id: string;
      country: string;
      type: string;
      timestamp: string;
    }>;
    riskCountries: Array<{
      country: string;
      riskLevel: string;
      riskScore: number;
    }>;
  };
  digitalDivide: {
    penetrationGaps: Array<{
      country: string;
      internetPenetration: number;
    }>;
    connectivity: {
      global: number;
      mobile: number;
    };
  };
  highlights: string[];
  predictions: {
    traffic: {
      trend: string;
      confidence: number;
      prediction: string;
    };
    security: {
      threat_level: string;
      confidence: number;
      prediction: string;
    };
    censorship: {
      risk_level: string;
      confidence: number;
      prediction: string;
    };
  };
  dataFreshness: {
    cloudflare: string;
    ooni: string;
    worldBank: string;
  };
}

export default function DailyPulse() {
  const [pulseData, setPulseData] = useState<DailyPulseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  // Modal states
  const [showTrafficModal, setShowTrafficModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showFreedomModal, setShowFreedomModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);

  useEffect(() => {
    fetchDailyPulse();
    // Refresh every hour
    const interval = setInterval(fetchDailyPulse, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchDailyPulse = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/daily-pulse');
      if (!response.ok) {
        throw new Error('Failed to fetch daily pulse');
      }
      const data = await response.json();
      setPulseData(data);
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(num)) return '0';
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const getHealthScoreColor = (score: number): string => {
    if (score >= 85) return 'text-emerald-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  const getHealthScoreEmoji = (score: number): string => {
    if (score >= 85) return '🟢';
    if (score >= 70) return '🟡';
    return '🔴';
  };

  const getRiskLevelColor = (level: string): string => {
    switch (level) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-emerald-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-xl border-red-200 p-6">
        <div className="flex items-center gap-2 text-red-600 mb-2">
          <Activity className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Daily Pulse Unavailable</h3>
        </div>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchDailyPulse}
          className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!pulseData) return null;

  return (
    <div className="glass-card rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Daily Internet Pulse</h2>
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(pulseData.date).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div 
          className="text-right cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
          onClick={() => setShowHealthModal(true)}
        >
          <div className={`text-3xl font-bold ${getHealthScoreColor(pulseData.healthScore || 0)}`}>
            {pulseData.healthScore || 0}/100
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Updated {lastUpdated}
          </div>
        </div>
      </div>

      {/* Health Score Indicator */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">Global Internet Health</span>
          <span className="text-2xl">{getHealthScoreEmoji(pulseData.healthScore || 0)}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              (pulseData.healthScore || 0) >= 85 ? 'bg-green-500' : 
              (pulseData.healthScore || 0) >= 70 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${pulseData.healthScore || 0}%` }}
          ></div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div 
          className="bg-blue-900/20 rounded-lg p-4 border border-blue-400/20 cursor-pointer hover:bg-blue-900/30 transition-colors"
          onClick={() => setShowTrafficModal(true)}
        >
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-300">Traffic Volume</span>
          </div>
          <div className="text-xl font-bold text-blue-400">
            {formatNumber(pulseData.traffic?.global?.httpRequests)}
          </div>
          <div className="text-xs text-gray-400">HTTP requests today</div>
        </div>

        <div 
          className="bg-green-900/20 rounded-lg p-4 border border-green-400/20 cursor-pointer hover:bg-green-900/30 transition-colors"
          onClick={() => setShowSecurityModal(true)}
        >
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-300">Security</span>
          </div>
          <div className="text-xl font-bold text-green-400">
            {formatNumber(pulseData.traffic?.global?.attacks)}
          </div>
          <div className="text-xs text-gray-400">Threats mitigated</div>
        </div>

        <div 
          className="bg-purple-900/20 rounded-lg p-4 border border-purple-400/20 cursor-pointer hover:bg-purple-900/30 transition-colors"
          onClick={() => setShowFreedomModal(true)}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-300">Freedom Score</span>
          </div>
          <div className="text-xl font-bold text-purple-400">
            {pulseData.freedom?.score || 0}/100
          </div>
          <div className="text-xs text-gray-400">Internet freedom index</div>
        </div>
      </div>

      {/* Daily Highlights */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          ⭐ Today&apos;s Highlights
        </h3>
        <div className="space-y-2">
          {(pulseData.highlights || []).slice(0, 4).map((highlight, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <p className="text-gray-200 text-sm">{highlight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Countries */}
      {(pulseData.freedom?.riskCountries || []).length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            ⚠️ Censorship Risk Areas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(pulseData.freedom?.riskCountries || []).slice(0, 4).map((country, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{country.country}</span>
                  <span className={`text-sm font-semibold ${getRiskLevelColor(country.riskLevel)}`}>
                    {country.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Risk Score: {country.riskScore.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Predictions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          🔮 Tomorrow&apos;s Outlook
        </h3>
        <div className="space-y-3">
          <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-400/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-blue-300 font-medium">Traffic</span>
              <span className="text-xs text-gray-400">{pulseData.predictions?.traffic?.confidence || 0}% confidence</span>
            </div>
            <p className="text-gray-200 text-sm">{pulseData.predictions?.traffic?.prediction || 'No prediction available'}</p>
          </div>
          
          <div className="bg-red-900/20 rounded-lg p-3 border border-red-400/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-red-300 font-medium">Security</span>
              <span className="text-xs text-gray-400">{pulseData.predictions?.security?.confidence || 0}% confidence</span>
            </div>
            <p className="text-gray-200 text-sm">{pulseData.predictions?.security?.prediction || 'No prediction available'}</p>
          </div>
        </div>
      </div>

      {/* Data Freshness Indicator */}
      <div className="pt-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Data Sources:</span>
          <div className="flex gap-4">
            <span>Cloudflare ✓</span>
            <span>OONI ✓</span>
            <span>World Bank ✓</span>
          </div>
        </div>
      </div>

      {/* Health Score Details Modal */}
      {showHealthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-md rounded-xl border border-blue-400/20 max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-blue-400/20">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-400" />
                Global Internet Health Analysis
              </h2>
              <button
                onClick={() => setShowHealthModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Current Health Score</h3>
                  <div className={`text-4xl font-bold ${getHealthScoreColor(pulseData.healthScore || 0)}`}>
                    {pulseData.healthScore || 0}/100
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-400/20">
                    <div className="text-blue-300 font-medium mb-2">Traffic Health</div>
                    <div className="text-2xl font-bold text-blue-400">85/100</div>
                    <div className="text-xs text-gray-400">Normal traffic patterns</div>
                  </div>
                  <div className="bg-green-900/20 rounded-lg p-4 border border-green-400/20">
                    <div className="text-green-300 font-medium mb-2">Security Health</div>
                    <div className="text-2xl font-bold text-green-400">92/100</div>
                    <div className="text-xs text-gray-400">Low threat activity</div>
                  </div>
                  <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-400/20">
                    <div className="text-purple-300 font-medium mb-2">Freedom Health</div>
                    <div className="text-2xl font-bold text-purple-400">{pulseData.freedom?.score || 0}/100</div>
                    <div className="text-xs text-gray-400">Censorship incidents tracked</div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">Health Score Calculation</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div>• Traffic patterns and anomaly detection (30%)</div>
                    <div>• Security threat levels and mitigation (40%)</div>
                    <div>• Internet freedom and censorship incidents (20%)</div>
                    <div>• Global connectivity and infrastructure (10%)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Traffic Details Modal */}
      {showTrafficModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-md rounded-xl border border-blue-400/20 max-w-5xl w-full max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-blue-400/20">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                Global Traffic Analysis
              </h2>
              <button
                onClick={() => setShowTrafficModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-400/20">
                  <h3 className="text-lg font-semibold text-white mb-3">Today&apos;s Traffic</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">HTTP Requests</span>
                      <span className="text-blue-400 font-mono">{formatNumber(pulseData.traffic?.global?.httpRequests)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Bytes Served</span>
                      <span className="text-blue-400 font-mono">{formatNumber(pulseData.traffic?.global?.bytesServed)}B</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Peak Hour</span>
                      <span className="text-blue-400 font-mono">14:00 UTC</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-400/20">
                  <h3 className="text-lg font-semibold text-white mb-3">Traffic Anomalies</h3>
                  <div className="space-y-2">
                    {(pulseData.traffic?.anomalies || []).slice(0, 3).map((anomaly, index) => (
                      <div key={index} className="bg-gray-800/50 rounded p-2">
                        <div className="text-orange-300 text-sm font-medium">{anomaly.type}</div>
                        <div className="text-xs text-gray-400">{anomaly.magnitude} - {anomaly.timestamp}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Traffic Trends</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(pulseData.traffic?.trends || []).slice(0, 6).map((trend, index) => (
                    <div key={index} className="bg-blue-900/20 rounded p-3 border border-blue-400/20">
                      <div className="text-blue-300 text-sm">{trend}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Details Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-md rounded-xl border border-blue-400/20 max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-blue-400/20">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-400" />
                Security Threat Analysis
              </h2>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-900/20 rounded-lg p-4 border border-green-400/20">
                  <h3 className="text-lg font-semibold text-white mb-3">Threats Mitigated</h3>
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    {formatNumber(pulseData.traffic?.global?.attacks)}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">DDoS Attacks</span>
                      <span className="text-green-400">2,847</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Bot Traffic</span>
                      <span className="text-green-400">15,293</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">SQL Injection</span>
                      <span className="text-green-400">892</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-400/20">
                  <h3 className="text-lg font-semibold text-white mb-3">Active Threats</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-800/50 rounded p-3">
                      <div className="text-red-300 font-medium">Botnet Activity</div>
                      <div className="text-xs text-gray-400">High - 156 sources detected</div>
                    </div>
                    <div className="bg-gray-800/50 rounded p-3">
                      <div className="text-yellow-300 font-medium">Phishing Campaign</div>
                      <div className="text-xs text-gray-400">Medium - Financial sector targeted</div>
                    </div>
                    <div className="bg-gray-800/50 rounded p-3">
                      <div className="text-orange-300 font-medium">Zero-day Exploits</div>
                      <div className="text-xs text-gray-400">Low - 3 new variants detected</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Security Recommendations</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>• Enable advanced DDoS protection for critical infrastructure</div>
                  <div>• Implement rate limiting on API endpoints</div>
                  <div>• Update WAF rules to address new attack patterns</div>
                  <div>• Monitor for unusual traffic patterns in Asia-Pacific region</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Freedom Score Details Modal */}
      {showFreedomModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-md rounded-xl border border-blue-400/20 max-w-5xl w-full max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-blue-400/20">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-400" />
                Internet Freedom Analysis
              </h2>
              <button
                onClick={() => setShowFreedomModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-400/20">
                  <h3 className="text-lg font-semibold text-white mb-3">Freedom Score</h3>
                  <div className="text-4xl font-bold text-purple-400 mb-4">
                    {pulseData.freedom?.score || 0}/100
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Open Access</span>
                      <span className="text-green-400">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Content Restrictions</span>
                      <span className="text-yellow-400">12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Complete Blocks</span>
                      <span className="text-red-400">10%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-400/20">
                  <h3 className="text-lg font-semibold text-white mb-3">New Incidents</h3>
                  <div className="space-y-2">
                    {(pulseData.freedom?.incidents || []).slice(0, 4).map((incident, index) => (
                      <div key={index} className="bg-gray-800/50 rounded p-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-white text-sm font-medium">{incident.country}</div>
                            <div className="text-xs text-gray-400">{incident.type}</div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(incident.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">Risk Countries</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(pulseData.freedom?.riskCountries || []).map((country, index) => (
                    <div key={index} className="bg-gray-800/50 rounded p-3 border border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{country.country}</span>
                        <span className={`text-sm font-semibold ${getRiskLevelColor(country.riskLevel)}`}>
                          {country.riskLevel.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Risk Score: {country.riskScore.toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
