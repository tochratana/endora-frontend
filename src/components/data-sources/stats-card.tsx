import type React from "react";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

export function StatsCard({ icon, value, label }: StatsCardProps) {
  return (
    <Card className="bg-white border-gray-200 dark:bg-slate-900 dark:border-slate-800 p-6">
      <div className="flex flex-col  gap-3">
        {" "}
        {/* Changed to flex-col and items-center */}
        <div className="w-10 h-10 rounded-lg">
          <div className="text-teal-400 w-5 h-5">{icon}</div>
        </div>
        <div className="">
          {" "}
          {/* Added text-center for centered alignment */}
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
          <div className="text-gray-400 text-sm">{label}</div>
        </div>
      </div>
    </Card>
  );
}
