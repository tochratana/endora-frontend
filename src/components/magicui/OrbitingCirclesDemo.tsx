"use client";

import {
  FiDatabase,
  FiGlobe,
  FiShield,
  FiCloud,
  FiCode,
  FiZap,
  FiHardDrive,
  FiLock,
  FiTrello,
} from "react-icons/fi";
import { OrbitingCircles } from "@/components/magicui/orbiting-circles";

const icons = [
  { name: "database", icon: FiDatabase },
  { name: "api", icon: FiCode },
  { name: "auth", icon: FiShield },
  { name: "cloud", icon: FiCloud },
  { name: "functions", icon: FiGlobe },
];

const smallerIcons = [
  { name: "realtime", icon: FiZap },
  { name: "storage", icon: FiHardDrive },
  { name: "security", icon: FiLock },
  { name: "vector", icon: FiTrello },
];

export function OrbitingCirclesDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden">
      <OrbitingCircles iconSize={65} radius={170}>
        {icons.map(iconData => {
          const IconComponent = iconData.icon;
          return (
            <div
              key={iconData.name}
              className="flex items-center justify-center w-[65px] h-[65px] max-sm:w-[50px] max-sm:h-[50px] bg-white dark:bg-white/30 rounded-full backdrop-blur-sm border border-gray-300 dark:border-white/50 shadow-lg dark:shadow-none"
            >
              <IconComponent
                size={32}
                className="text-primary-500 dark:text-primary-600 max-sm:!w-6 max-sm:!h-6"
              />
            </div>
          );
        })}
      </OrbitingCircles>
      <OrbitingCircles iconSize={50} radius={100} reverse speed={2}>
        {smallerIcons.map(iconData => {
          const IconComponent = iconData.icon;
          return (
            <div
              key={iconData.name}
              className="flex items-center justify-center w-[50px] h-[50px] max-sm:w-[38px] max-sm:h-[38px] bg-white/90 dark:bg-white/10 rounded-full backdrop-blur-sm border border-gray-300/50 dark:border-white/20 shadow-md dark:shadow-none"
            >
              <IconComponent
                size={24}
                className="text-teal-500 dark:text-teal-600 max-sm:!w-5 max-sm:!h-5"
              />
            </div>
          );
        })}
      </OrbitingCircles>
    </div>
  );
}
