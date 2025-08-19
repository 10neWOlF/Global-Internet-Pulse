"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Activity, Shield } from "lucide-react";

interface CountryData {
  name: string;
  code: string;
  lat: number;
  lng: number;
  status: "normal" | "heavy" | "outage";
  responseTime: number;
  censorship: boolean;
  traffic: number;
}

const sampleData: CountryData[] = [
  { name: "United States", code: "US", lat: 39.8283, lng: -98.5795, status: "normal", responseTime: 45, censorship: false, traffic: 85 },
  { name: "China", code: "CN", lat: 35.8617, lng: 104.1954, status: "heavy", responseTime: 156, censorship: true, traffic: 92 },
  { name: "Germany", code: "DE", lat: 51.1657, lng: 10.4515, status: "normal", responseTime: 32, censorship: false, traffic: 78 },
  { name: "Russia", code: "RU", lat: 61.5240, lng: 105.3188, status: "outage", responseTime: 0, censorship: true, traffic: 15 },
  { name: "Brazil", code: "BR", lat: -14.2350, lng: -51.9253, status: "normal", responseTime: 89, censorship: false, traffic: 67 },
  { name: "India", code: "IN", lat: 20.5937, lng: 78.9629, status: "heavy", responseTime: 134, censorship: false, traffic: 89 },
  { name: "Japan", code: "JP", lat: 36.2048, lng: 138.2529, status: "normal", responseTime: 28, censorship: false, traffic: 82 },
  { name: "United Kingdom", code: "GB", lat: 55.3781, lng: -3.4360, status: "normal", responseTime: 41, censorship: false, traffic: 76 },
  { name: "France", code: "FR", lat: 46.6034, lng: 1.8883, status: "normal", responseTime: 38, censorship: false, traffic: 73 },
  { name: "Iran", code: "IR", lat: 32.4279, lng: 53.6880, status: "heavy", responseTime: 189, censorship: true, traffic: 34 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "normal": return "#22c55e";
    case "heavy": return "#eab308";
    case "outage": return "#ef4444";
    default: return "#6b7280";
  }
};

const getRadius = (traffic: number) => {
  return Math.max(8, Math.min(25, traffic / 4));
};

function MapEvents() {
  const map = useMap();
  
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  
  return null;
}

export default function WorldMapClient() {
  return (
    <div className="relative">
      <div className="h-96 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <MapEvents />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          
          {sampleData.map((country) => (
            <CircleMarker
              key={country.code}
              center={[country.lat, country.lng]}
              radius={getRadius(country.traffic)}
              fillColor={getStatusColor(country.status)}
              color={getStatusColor(country.status)}
              weight={2}
              opacity={0.8}
              fillOpacity={0.6}
            >
              <Popup>
                <div className="p-3 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-200">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">{country.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">Status: </span>
                      <span className={`font-semibold ${
                        country.status === "normal" ? "text-emerald-600" :
                        country.status === "heavy" ? "text-amber-600" : "text-red-600"
                      }`}>
                        {country.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <span>Response Time: {country.responseTime}ms</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <span>Traffic Load: {country.traffic}%</span>
                    </div>
                    {country.censorship && (
                      <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        <Shield className="w-4 h-4" />
                        <span>Censorship detected</span>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-gray-800 text-sm shadow-lg border border-gray-200">
        <h4 className="font-semibold mb-2 text-gray-800">Status Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-gray-700">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-gray-700">Heavy Traffic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-700">Outage</span>
          </div>
        </div>
      </div>
    </div>
  );
}
