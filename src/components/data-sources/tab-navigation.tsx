"use client"

import type { TabItem, TabType } from "@/types/dataSource"

interface TabNavigationProps {
  tabs: TabItem[]
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex border-b border-slate-700 mb-8 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "text-white bg-teal-600 border-b-2 border-teal-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <div className="w-4 h-4">{tab.icon}</div>
          {tab.label}
        </button>
      ))}
    </div>
  )
}
