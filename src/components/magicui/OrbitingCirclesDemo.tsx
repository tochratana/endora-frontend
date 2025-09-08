"use client";

import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import {
  FaDatabase,
  FaCloud,
  FaLock,
  FaServer,
  FaCogs,
  FaBolt,
  FaRocket,
  FaCode,
} from "react-icons/fa";

export function OrbitingCirclesDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden">
      <OrbitingCircles iconSize={40}>
        <FaDatabase size={40} /> {/* Database */}
        <FaServer size={40} /> {/* API */}
        <FaLock size={40} /> {/* Auth */}
        <FaCloud size={40} /> {/* Storage */}
        <FaCogs size={40} /> {/* Functions */}
      </OrbitingCircles>
      <OrbitingCircles iconSize={30} radius={100} reverse speed={2}>
        <FaBolt size={30} /> {/* Realtime */}
        <FaRocket size={30} /> {/* Performance */}
        <FaCode size={30} /> {/* Code */}
        <FaCloud size={30} /> {/* Cloud */}
      </OrbitingCircles>
    </div>
  );
}
