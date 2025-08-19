"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Activity } from "lucide-react";

// Dynamically import the map component with no SSR
const DynamicWorldMap = dynamic(() => import("./WorldMapClient"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
      <div className="text-gray-600 flex items-center gap-2">
        <Activity className="w-5 h-5 animate-pulse text-blue-600" />
        Loading map...
      </div>
    </div>
  ),
});

export default function WorldMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
        <div className="text-gray-600 flex items-center gap-2">
          <Activity className="w-5 h-5 animate-pulse text-blue-600" />
          Loading map...
        </div>
      </div>
    );
  }

  return <DynamicWorldMap />;
}
