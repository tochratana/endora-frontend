"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes"; // Import useTheme hook

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

interface ErrorResponse {
  message?: string;
  error?: string;
  data?:
    | {
        message?: string;
        error?: string;
      }
    | string;
  status?: number;
}
import {
  RefreshCcw,
  Trash2,
  Play,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";
import {
  useGetProjectByUuidQuery,
  useInsertTableDataFromEditorMutation,
} from "@/service/project/projectApi";
import { useGetSchemasQuery } from "@/service/apiSlide/schemaApi";

interface PageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

interface SchemaTab {
  schemaName: string;
  isActive: boolean;
  editorValue: string;
}

interface Notification {
  type: "success" | "error";
  message: string;
  details?: string;
}

const JSONEditor = ({ params }: PageProps) => {
  const { workspaceId } = use(params);
  const { theme, resolvedTheme } = useTheme(); // Get current theme
  console.log("Workspace ID:", workspaceId);

  const [activeSchema, setActiveSchema] = useState("");
  const [schemaTabs, setSchemaTabs] = useState<SchemaTab[]>([]);
  const [notification, setNotification] = useState<Notification | null>(null);

  const {
    data: schemas,
    error: schemaError,
    isLoading: schemaLoading,
  } = useGetSchemasQuery(workspaceId);

  console.log("Schema Error", schemaError);
  console.log("This is all schema", schemas);

  const editorRef = useRef<HTMLDivElement | null>(null);
  const monacoRef = useRef<IMonacoEditor | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [projectUuid, setProjectUuid] = useState("");
  const [isMonacoLoaded, setIsMonacoLoaded] = useState(false);

  // Fetch project data
  const {
    data: response,
    error: projectError,
    isLoading: isProjectLoading,
  } = useGetProjectByUuidQuery(workspaceId);

  console.log("Data of project", response);

  const [insertTableDataFromEditor, { isLoading: isUploading }] =
    useInsertTableDataFromEditorMutation();

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Initialize schema tabs when schemas are loaded
  useEffect(() => {
    if (schemas && schemas.length > 0) {
      const initialTabs = schemas.map((schema, index) => ({
        schemaName: schema.schemaName,
        isActive: index === 0,
        editorValue: `[\n  { "id": 1, "name": "Sample data for ${schema.schemaName}" },\n  { "id": 2, "name": "Another record" }\n]`,
      }));

      setSchemaTabs(initialTabs);
      setActiveSchema(initialTabs[0].schemaName);
    }
  }, [schemas]);

  // Set project UUID when data is fetched
  useEffect(() => {
    if (response) {
      if (
        "data" in response &&
        typeof response.data === "object" &&
        response.data &&
        "projectUuid" in response.data
      ) {
        setProjectUuid(response.data.projectUuid as string);
      } else if (
        "projectUuid" in response &&
        typeof response.projectUuid === "string"
      ) {
        setProjectUuid(response.projectUuid);
      } else if (workspaceId) {
        setProjectUuid(workspaceId);
      }
    }
  }, [response, workspaceId]);

  // Update Monaco theme when global theme changes
  useEffect(() => {
    if (monacoRef.current && isReady && window.monaco) {
      const isDark = resolvedTheme === "dark";
      monacoRef.current.updateOptions({
        theme: isDark ? "vs-dark" : "vs",
      });
    }
  }, [resolvedTheme, isReady]);

  // Load Monaco Editor
  useEffect(() => {
    if (isMonacoLoaded || typeof window === "undefined") return;

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
    script.onload = () => {
      loadMonacoEditor();
    };
    script.onerror = () => {
      console.error("Failed to load require.js");
      setIsReady(true);
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMonacoLoaded]);

  const loadMonacoEditor = () => {
    window.require.config({
      paths: {
        vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.38.0/min/vs",
      },
    });

    window.MonacoEnvironment = {
      getWorkerUrl: () => {
        return URL.createObjectURL(
          new Blob(
            [
              'self.MonacoEnvironment = { baseUrl: "https://cdn.jsdelivr.net/npm/monaco-editor@0.38.0/min/" }; importScripts("https://cdn.jsdelivr.net/npm/monaco-editor@0.38.0/min/vs/base/worker/workerMain.js");',
            ],
            { type: "text/javascript" }
          )
        );
      },
    };

    window.require(["vs/editor/editor.main"], () => {
      setIsMonacoLoaded(true);
      initializeEditor();
    });
  };

  const initializeEditor = () => {
    if (!editorRef.current || monacoRef.current) return;

    const activeTab = schemaTabs.find(tab => tab.isActive);
    const isDark = resolvedTheme === "dark";

    monacoRef.current = window.monaco.editor.create(editorRef.current, {
      value: activeTab?.editorValue || "",
      language: "json",
      theme: isDark ? "vs-dark" : "vs",
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      scrollBeyondLastLine: false,
      wordWrap: "on",
      tabSize: 2,
      readOnly: false,
    });

    if (monacoRef.current) {
      monacoRef.current.onDidChangeModelContent(() => {
        if (monacoRef.current) {
          const value = monacoRef.current.getValue();
          setSchemaTabs(prev =>
            prev.map(tab =>
              tab.schemaName === activeSchema
                ? { ...tab, editorValue: value }
                : tab
            )
          );
        }
      });
    }

    setIsReady(true);
  };

  useEffect(() => {
    if (
      monacoRef.current &&
      isReady &&
      isMonacoLoaded &&
      schemaTabs.length > 0 &&
      activeSchema
    ) {
      const activeTab = schemaTabs.find(tab => tab.schemaName === activeSchema);
      if (activeTab) {
        const position = monacoRef.current.getPosition();
        monacoRef.current.setValue(activeTab.editorValue);
        if (position) {
          monacoRef.current.setPosition(position);
        }
        setTimeout(() => {
          monacoRef.current?.focus();
        }, 0);
      }
    }
  }, [activeSchema, isReady, isMonacoLoaded, schemaTabs]);

  useEffect(() => {
    if (!monacoRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      setTimeout(() => {
        monacoRef.current?.layout();
      }, 100);
    });

    if (editorRef.current) {
      resizeObserver.observe(editorRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [isReady]);

  const handleTabClick = (schemaName: string) => {
    if (monacoRef.current && activeSchema) {
      const currentValue = monacoRef.current.getValue();
      setSchemaTabs(prev =>
        prev.map(tab =>
          tab.schemaName === activeSchema
            ? { ...tab, editorValue: currentValue }
            : tab
        )
      );
    }

    setActiveSchema(schemaName);

    setSchemaTabs(prev =>
      prev.map(tab => ({
        ...tab,
        isActive: tab.schemaName === schemaName,
      }))
    );
  };

  const formatCode = () => {
    if (!monacoRef.current) return;
    try {
      const currentValue = monacoRef.current.getValue();
      if (!currentValue.trim()) {
        const basicJSON = `[\n  {\n    "id": 1,\n    "name": "example"\n  }\n]`;
        monacoRef.current.setValue(basicJSON);

        setSchemaTabs(prev =>
          prev.map(tab =>
            tab.schemaName === activeSchema
              ? { ...tab, editorValue: basicJSON }
              : tab
          )
        );
        return;
      }

      const parsed = JSON.parse(currentValue);
      const formatted = JSON.stringify(parsed, null, 2);
      monacoRef.current.setValue(formatted);

      setSchemaTabs(prev =>
        prev.map(tab =>
          tab.schemaName === activeSchema
            ? { ...tab, editorValue: formatted }
            : tab
        )
      );
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

    setSchemaTabs(prev =>
      prev.map(tab =>
        tab.schemaName === activeSchema ? { ...tab, editorValue: "" } : tab
      )
    );
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

      console.log("Uploading data:", {
        projectUuid,
        schemaName: activeSchema,
        dataLength: recordCount,
      });

      const result = await insertTableDataFromEditor({
        projectUuid,
        schemaName: activeSchema,
        data: jsonData,
        format: "json",
        trimStrings: true,
        batchSize: 500,
      }).unwrap();

      setNotification({
        type: "success",
        message: `Successfully inserted ${recordCount} record${recordCount !== 1 ? "s" : ""}`,
        details: `Data uploaded to schema: ${activeSchema}`,
      });

      console.log("Upload result:", result);
    } catch (err: Error | ErrorResponse | unknown) {
      console.error("Full error object:", err);

      let errorMessage = "Upload failed";
      let errorDetails = "Unknown error occurred";

      if (typeof err === "string" && err.includes("<!DOCTYPE html>")) {
        errorMessage = "Network Error";
        errorDetails = "Received HTML response. Check CORS or API endpoint.";
      } else if (err instanceof SyntaxError) {
        errorMessage = "Invalid JSON";
        errorDetails = "Please check your JSON syntax";
      } else if (err && typeof err === "object" && "data" in err) {
        const errorObj = err as ErrorResponse;
        try {
          const errorData =
            typeof errorObj.data === "string"
              ? JSON.parse(errorObj.data)
              : errorObj.data;
          errorMessage =
            (errorData as { message?: string; error?: string })?.message ||
            (errorData as { message?: string; error?: string })?.error ||
            "API Error";
          errorDetails = JSON.stringify(errorData);
        } catch {
          const errData = errorObj.data;
          errorMessage =
            (typeof errData === "object" && errData
              ? errData.message || errData.error
              : undefined) || "API Error";
          errorDetails = String(errorObj.data);
        }
      } else if (err && typeof err === "object" && "status" in err) {
        const errorObj = err as ErrorResponse;
        errorMessage = `Error ${errorObj.status}`;
        errorDetails = errorObj.error || "Request failed";
      } else if (err instanceof Error) {
        errorMessage = "Error";
        errorDetails = err.message;
      }

      setNotification({
        type: "error",
        message: errorMessage,
        details: errorDetails,
      });
    }
  };

  if (isProjectLoading || schemaLoading) {
    return (
      <div className="h-screen bg-white dark:bg-slate-900 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-2"></div>
          Loading project data...
        </div>
      </div>
    );
  }

  if (projectError || schemaError) {
    return (
      <div className="h-screen bg-white dark:bg-slate-900 flex items-center justify-center text-red-400">
        <div className="text-center">
          <p>Error loading project data</p>
          <p className="text-sm mt-2">
            {(projectError && "message" in projectError
              ? projectError.message
              : "") ||
              (schemaError && "message" in schemaError
                ? schemaError.message
                : "") ||
              "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white dark:bg-slate-900">
      <div className="flex flex-col h-full pt-20">
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
                className="flex-shrink-0 hover:opacity-70 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Schema Tabs */}
        <div className="flex border-b border-gray-300 bg-gray-200 dark:border-gray-700 dark:bg-gray-800">
          {schemaTabs.map(tab => (
            <button
              key={tab.schemaName}
              onClick={() => handleTabClick(tab.schemaName)}
              className={`px-4 py-2 border-r border-gray-300 dark:border-gray-700 text-sm font-medium transition-colors ${
                tab.isActive
                  ? "bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-b-2 border-blue-500"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-750"
              }`}
            >
              {tab.schemaName}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <button
              onClick={formatCode}
              disabled={!isReady}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCcw className="w-4 h-4" /> Format
            </button>
            <button
              onClick={clearEditor}
              disabled={!isReady}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Schema:{" "}
              <span className="text-gray-900 dark:text-white font-semibold">
                {activeSchema}
              </span>
            </span>
            <button
              onClick={runQuery}
              disabled={
                !isReady || !projectUuid || !activeSchema || isUploading
              }
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" /> Run
                </>
              )}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 relative">
          <div
            ref={editorRef}
            className="h-full w-full"
            style={{ minHeight: "400px" }}
          />
          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-slate-900/80 z-10">
              <div className="text-center text-gray-600 dark:text-gray-400">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-2"></div>
                Loading Editor...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JSONEditor;
