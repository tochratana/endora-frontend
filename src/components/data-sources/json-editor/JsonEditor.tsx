"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  RefreshCcw,
  Trash2,
  Play,
  CheckCircle,
  XCircle,
} from "lucide-react";

declare global {
  interface Window {
    monaco: typeof import("monaco-editor");
    require: {
      config: (config: { paths: Record<string, string> }) => void;
      (modules: string[], callback: () => void): void;
    };
    MonacoEnvironment?: {
      getWorkerUrl: (moduleId: string, label: string) => string;
    };
  }
}

interface IMonacoEditor {
  getValue(): string;
  setValue(value: string): void;
  getPosition(): { lineNumber: number; column: number } | null;
  setPosition(position: { lineNumber: number; column: number }): void;
  layout(): void;
  focus(): void;
  onDidChangeModelContent(listener: () => void): void;
  updateOptions(options: any): void;
}

interface Notification {
  type: "success" | "error";
  message: string;
  details?: string;
}

export function JsonEditor({
  isOpen,
  onClose,
  schemas,
  projectUuid,
  onInsertData,
  theme = "light",
}: {
  isOpen: boolean;
  onClose: () => void;
  schemas: Array<{ schemaName: string }>;
  projectUuid: string;
  onInsertData: (schemaName: string, data: any) => Promise<void>;
  theme?: "light" | "dark";
}) {
  const [activeSchema, setActiveSchema] = useState("");
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const editorRef = useRef<HTMLDivElement | null>(null);
  const monacoRef = useRef<IMonacoEditor | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isMonacoLoaded, setIsMonacoLoaded] = useState(false);

  // Set initial active schema
  useEffect(() => {
    if (schemas && schemas.length > 0 && !activeSchema) {
      setActiveSchema(schemas[0].schemaName);
    }
  }, [schemas, activeSchema]);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Update Monaco theme
  useEffect(() => {
    if (monacoRef.current && isReady && window.monaco) {
      monacoRef.current.updateOptions({
        theme: theme === "dark" ? "vs-dark" : "vs",
      });
    }
  }, [theme, isReady]);

  // Load Monaco Editor
  useEffect(() => {
    if (!isOpen || isMonacoLoaded || typeof window === "undefined") return;

    if (window.monaco && window.monaco.editor) {
      initializeEditor();
      return;
    }

    if (window.require) {
      loadMonacoEditor();
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js";
    script.onload = () => loadMonacoEditor();
    script.onerror = () => console.error("Failed to load require.js");
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [isOpen, isMonacoLoaded]);

  const loadMonacoEditor = () => {
    window.require.config({
      paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.38.0/min/vs" },
    });

    window.MonacoEnvironment = {
      getWorkerUrl: () =>
        URL.createObjectURL(
          new Blob(
            [
              'self.MonacoEnvironment = { baseUrl: "https://cdn.jsdelivr.net/npm/monaco-editor@0.38.0/min/" }; importScripts("https://cdn.jsdelivr.net/npm/monaco-editor@0.38.0/min/vs/base/worker/workerMain.js");',
            ],
            { type: "text/javascript" }
          )
        ),
    };

    window.require(["vs/editor/editor.main"], () => {
      setIsMonacoLoaded(true);
      initializeEditor();
    });
  };

  const initializeEditor = () => {
    if (!editorRef.current || monacoRef.current) return;

    const defaultValue = `[\n  { "id": 1, "name": "Sample data" },\n  { "id": 2, "name": "Another record" }\n]`;

    monacoRef.current = window.monaco.editor.create(editorRef.current, {
      value: defaultValue,
      language: "json",
      theme: theme === "dark" ? "vs-dark" : "vs",
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      scrollBeyondLastLine: false,
      wordWrap: "on",
      tabSize: 2,
    });

    setIsReady(true);
  };

  // Handle editor resize
  useEffect(() => {
    if (!monacoRef.current || !isOpen) return;

    const resizeObserver = new ResizeObserver(() => {
      setTimeout(() => monacoRef.current?.layout(), 100);
    });

    if (editorRef.current) {
      resizeObserver.observe(editorRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [isReady, isOpen]);

  const formatCode = () => {
    if (!monacoRef.current) return;
    try {
      const currentValue = monacoRef.current.getValue();
      if (!currentValue.trim()) {
        const basicJSON = `[\n  {\n    "id": 1,\n    "name": "example"\n  }\n]`;
        monacoRef.current.setValue(basicJSON);
        return;
      }
      const parsed = JSON.parse(currentValue);
      const formatted = JSON.stringify(parsed, null, 2);
      monacoRef.current.setValue(formatted);
    } catch (err) {
      setNotification({
        type: "error",
        message: "Invalid JSON",
        details: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  const clearEditor = () => {
    if (!monacoRef.current) return;
    monacoRef.current.setValue("");
  };

  const runQuery = async () => {
    if (!monacoRef.current || !projectUuid || !activeSchema) {
      setNotification({
        type: "error",
        message: "Missing required fields",
        details: "Project UUID or schema not found",
      });
      return;
    }

    try {
      const text = monacoRef.current.getValue().trim();
      if (!text) {
        setNotification({
          type: "error",
          message: "Empty content",
          details: "Please enter some JSON data before running",
        });
        return;
      }

      const jsonData = JSON.parse(text);
      const recordCount = Array.isArray(jsonData) ? jsonData.length : 1;

      setIsUploading(true);
      await onInsertData(activeSchema, jsonData);

      setNotification({
        type: "success",
        message: `Successfully inserted ${recordCount} record${recordCount !== 1 ? "s" : ""}`,
        details: `Data uploaded to schema: ${activeSchema}`,
      });

      // Clear editor after successful upload
      setTimeout(() => clearEditor(), 1000);
    } catch (err) {
      console.error("Upload error:", err);
      setNotification({
        type: "error",
        message: "Upload failed",
        details: err instanceof Error ? err.message : "Unknown error occurred",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-50" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[700px] lg:w-[900px] bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Notification Toast */}
        {notification && (
          <div className="absolute top-4 right-4 z-50 animate-in slide-in-from-top-5 duration-300">
            <div
              className={`flex items-start gap-3 p-4 rounded-lg shadow-lg border max-w-md ${
                notification.type === "success"
                  ? "bg-green-900/90 border-green-700 text-green-100"
                  : "bg-red-900/90 border-red-700 text-red-100"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{notification.message}</p>
                {notification.details && (
                  <p className="text-sm mt-1 opacity-90">
                    {notification.details}
                  </p>
                )}
              </div>
              <button
                onClick={() => setNotification(null)}
                className="flex-shrink-0 hover:opacity-70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            JSON Editor
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Schema Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
          {schemas.map(schema => (
            <button
              key={schema.schemaName}
              onClick={() => setActiveSchema(schema.schemaName)}
              className={`px-4 py-2 border-r border-slate-200 dark:border-slate-700 text-sm font-medium whitespace-nowrap transition-colors ${
                activeSchema === schema.schemaName
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-b-2 border-teal-500"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {schema.schemaName}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <button
              onClick={formatCode}
              disabled={!isReady}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded text-white text-sm disabled:opacity-50 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" /> Format
            </button>
            <button
              onClick={clearEditor}
              disabled={!isReady}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-white text-sm disabled:opacity-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
          </div>
          <button
            onClick={runQuery}
            disabled={!isReady || !activeSchema || isUploading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded text-white text-sm font-semibold disabled:opacity-50 transition-colors"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Uploading...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Run
              </>
            )}
          </button>
        </div>

        {/* Editor */}
        <div className="flex-1 relative">
          <div ref={editorRef} className="h-full w-full" />
          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-slate-900/80 z-10">
              <div className="text-center text-slate-600 dark:text-slate-400">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500 mx-auto mb-2"></div>
                Loading Editor...
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
