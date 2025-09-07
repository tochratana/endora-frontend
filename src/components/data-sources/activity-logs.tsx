

import { Clock, User } from "lucide-react";
import type { LogItem } from "@/types/dataSource";

interface ActivityLogsProps {
  logs: LogItem[];
}

export function ActivityLogs({ logs }: ActivityLogsProps) {
  const getActionColor = (action: LogItem["action"]) => {
    switch (action) {
      case "IMPORT": return "bg-teal-600";
      case "DELETE": return "bg-red-600";
      case "CREATE": return "bg-green-600";
      case "UPDATE": return "bg-orange-600";
      default:       return "bg-slate-600";
    }
  };

  if (!logs.length) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No activity yet. Actions you take will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="dark:bg-slate-800 rounded-lg p-4 border dark:border-slate-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="dark:text-white text-gray-500 font-medium mb-1">{log.title}</h3>
              <p className="text-slate-400 text-sm mb-3">{log.description}</p>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-slate-400 text-sm">
                  <User size={14} />
                  {log.user}
                </span>
                <span className={`px-2 py-1 rounded text-xs text-white ${getActionColor(log.action)}`}>
                  {log.action}
                </span>
              </div>
            </div>
            <span className="text-slate-400 text-sm">
              <Clock className="inline-block w-3.5 h-3.5 mr-1" />
              {new Date(log.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
