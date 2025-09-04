// import type React from "react"

// export interface DataSourceStats {
//   totalFields: number
//   totalRecords: number
//   lastUpdate: string | null
// }

// export type TabType = "database" | "logs" | "schedule"

// export interface TabItem {
//   id: TabType
//   label: string
//   icon: React.ReactNode
// }

// export interface SampleProduct {
//   id: number
//   name: string
//   price: number
//   created_date: string
// }

// //todo: for adding sample data
// export interface ActivityLog {
//   id: string
//   title: string
//   description: string
//   user: string
//   action: "IMPORT" | "DELETE" | "CREATE" | "UPDATE"
//   timestamp: string
// }

// export interface SampleData {
//   products: SampleProduct[]
//   logs: ActivityLog[]
//   hasData: boolean
// }

// types/dataSource.ts
// types/dataSource.ts
export type TabType = "database" | "real-data" | "logs" | "schedule";

export type LogAction = "IMPORT" | "DELETE" | "CREATE" | "UPDATE";

export interface SampleProduct {
  id: number;
  name: string;
  price: number;
  created_date: string; // yyyy-mm-dd
}

export interface LogItem {
  id: string;
  title: string;
  description: string;
  user: string;
  action: LogAction;
  timestamp: string; // ISO or human text
}

export interface SampleData {
  products: SampleProduct[];
  logs: LogItem[];
  hasData: boolean;
}

export interface TabItem {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}
