'use client';

import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Users, Calendar, ExternalLink, RefreshCw, Database, Eye, EyeOff } from 'lucide-react';

interface BreachData {
  Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  AddedDate: string;
  ModifiedDate: string;
  PwnCount: number;
  Description: string;
  LogoPath: string;
  DataClasses: string[];
  IsVerified: boolean;
  IsFabricated: boolean;
  IsSensitive: boolean;
  IsRetired: boolean;
  IsSpamList: boolean;
  IsMalware: boolean;
  IsSubscriptionFree: boolean;
}

interface BreachResponse {
  breaches: BreachData[];
  source: string;
  total: number;
  error?: string;
}

export default function DataBreachAlerts() {
  const [breaches, setBreaches] = useState<BreachData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [selectedBreach, setSelectedBreach] = useState<BreachData | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [dataSource, setDataSource] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const fetchBreaches = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/haveibeenpwned');
      const data: BreachResponse = await response.json();
      
      setBreaches(data.breaches);
      setDataSource(data.source);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch breach data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchBreaches();

    if (autoRefresh) {
      const interval = setInterval(fetchBreaches, 5 * 60 * 1000); // Update every 5 minutes
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getSeverityLevel = (breach: BreachData): 'critical' | 'high' | 'medium' | 'low' => {
    if (breach.IsSensitive && breach.PwnCount > 1000000) return 'critical';
    if (breach.IsSensitive || breach.PwnCount > 500000) return 'high';
    if (breach.PwnCount > 100000) return 'medium';
    return 'low';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredBreaches = severityFilter === 'all' 
    ? breaches 
    : breaches.filter(breach => getSeverityLevel(breach) === severityFilter);

  if (!mounted) {
    return <div className="animate-pulse bg-white/50 h-96 rounded-xl border border-gray-200"></div>;
  }

  return (
    <>
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Data Breach Alerts Feed
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Recent security incidents from HaveIBeenPwned
            </p>
          </div>
          <div className="flex items-center gap-3">
          <button
            onClick={fetchBreaches}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-3 py-1 text-sm rounded transition-colors ${
              autoRefresh 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            {autoRefresh ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            Auto-refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex items-center gap-4">
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="text-sm border border-gray-300 rounded px-3 py-1 bg-white"
        >
          <option value="all">All Severities ({breaches.length})</option>
          <option value="critical">Critical ({breaches.filter(b => getSeverityLevel(b) === 'critical').length})</option>
          <option value="high">High ({breaches.filter(b => getSeverityLevel(b) === 'high').length})</option>
          <option value="medium">Medium ({breaches.filter(b => getSeverityLevel(b) === 'medium').length})</option>
          <option value="low">Low ({breaches.filter(b => getSeverityLevel(b) === 'low').length})</option>
        </select>
        
        {lastUpdate && (
          <span className="text-xs text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
        )}
        
        <span className={`text-xs px-2 py-1 rounded ${
          dataSource === 'haveibeenpwned' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
        }`}>
          {dataSource === 'haveibeenpwned' ? '🟢 LIVE API' : '🟡 FALLBACK'}
        </span>
      </div>

      {/* Breach List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading breach data...</span>
          </div>
        ) : filteredBreaches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Shield className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No breaches found for selected filter</p>
          </div>
        ) : (
          filteredBreaches.map((breach) => {
            const severity = getSeverityLevel(breach);
            const daysAgo = getDaysAgo(breach.AddedDate);
            
            return (
              <div
                key={breach.Name}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedBreach(breach)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{breach.Title}</h4>
                        {breach.IsVerified && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            VERIFIED
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(severity)}`}>
                          {severity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{formatNumber(breach.PwnCount)} affected</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{daysAgo} days ago</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Domain:</span> {breach.Domain}
                    </div>
                    
                    <div className="text-sm text-gray-700 mb-2 line-clamp-2">
                      {breach.Description.replace(/<[^>]*>/g, '').substring(0, 150)}...
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {breach.DataClasses.slice(0, 3).map((dataClass) => (
                        <span key={dataClass} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                          {dataClass}
                        </span>
                      ))}
                      {breach.DataClasses.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          +{breach.DataClasses.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 text-right">
                    <div>Breach: {new Date(breach.BreachDate).toLocaleDateString()}</div>
                    <div>Added: {new Date(breach.AddedDate).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      </div>

      {/* Breach Detail Modal */}
      {selectedBreach && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="modal-card-red shadow-2xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedBreach.Title}</h2>
                    <p className="text-sm text-gray-600">
                      Data Breach • {formatNumber(selectedBreach.PwnCount)} accounts affected
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBreach(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Severity Level</div>
                  <div className={`text-lg font-semibold ${
                    getSeverityLevel(selectedBreach) === 'critical' ? 'text-red-600' :
                    getSeverityLevel(selectedBreach) === 'high' ? 'text-orange-600' :
                    getSeverityLevel(selectedBreach) === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {getSeverityLevel(selectedBreach).toUpperCase()}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Breach Date</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {new Date(selectedBreach.BreachDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Domain</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {selectedBreach.Domain}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedBreach.Description.replace(/<[^>]*>/g, '')}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Compromised Data Types</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedBreach.DataClasses.map((dataClass) => (
                    <span key={dataClass} className="bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm text-center">
                      {dataClass}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span>Verified: {selectedBreach.IsVerified ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span>Sensitive: {selectedBreach.IsSensitive ? 'Yes' : 'No'}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <a
                  href={`https://haveibeenpwned.com/PwnedWebsites#${selectedBreach.Name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on HaveIBeenPwned
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
