'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Globe, Zap, Shield, TrendingUp, X, Clock, Activity, Server } from 'lucide-react';

// Generate dynamic uptime data for the last 7 days with current 2025 dates
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

export default function StatisticsPanelFixed() {
  // Generate fresh uptime data with current dates
  const [uptimeData, setUptimeData] = useState(() => generateUptimeData());
  
  // Calculate dynamic uptime metrics
  const currentUptime = uptimeData[uptimeData.length - 1]?.uptime || 99.7;
  const weeklyAverageUptime = Math.round((uptimeData.reduce((sum, day) => sum + day.uptime, 0) / uptimeData.length) * 10) / 10;
  const slaTarget = 99.5;
  const meetingSLA = weeklyAverageUptime >= slaTarget;

  const [stats, setStats] = useState({
    averageResponseTime: 245,
    activeOutages: 10,
    censorshipEvents: 12,
    totalTraffic: '847.2 Tbps',
    uptime: currentUptime,
  });

  const [mounted, setMounted] = useState(false);
  const [showUptimeModal, setShowUptimeModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Refresh uptime data daily (every 24 hours)
    const refreshUptimeData = () => {
      setUptimeData(generateUptimeData());
    };
    
    const uptimeRefreshInterval = setInterval(refreshUptimeData, 24 * 60 * 60 * 1000);
    
    return () => {
      clearInterval(uptimeRefreshInterval);
    };
  }, []);

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
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Globe className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
              LIVE
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{currentUptime}%</p>
            <p className="text-sm text-gray-600">Global Uptime</p>
            <div className="flex items-center text-xs text-emerald-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              {meetingSLA ? '✓ Meeting SLA' : '⚠ Below SLA'}
            </div>
          </div>
        </div>

        {/* Other cards would go here */}
      </div>

      {/* Uptime Modal */}
      {showUptimeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Globe className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Global Uptime Analysis</h2>
                    <p className="text-sm text-gray-600">7-day uptime performance metrics</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUptimeModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Uptime History</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={uptimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis 
                      domain={[99, 100]}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#f3f4f6'
                      }}
                      formatter={(value: any) => [`${value}%`, 'Uptime']}
                      labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="uptime" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#059669' }}
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
    </>
  );
}
