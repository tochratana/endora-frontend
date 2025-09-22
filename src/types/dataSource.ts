// export type TabType = "database" | "real-data" | "logs" | "schedule";
export type TabType = "database" | "logs" | "schedule";

export type LogAction = "IMPORT" | "DELETE" | "CREATE" | "UPDATE" | "ERROR" | "REFRESH";

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
