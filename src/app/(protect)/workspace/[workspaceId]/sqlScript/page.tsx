"use client";
import React, { useEffect, useRef, useState } from "react";
import { RefreshCcw, Trash2, Play } from "lucide-react";
import {
  useGetProjectByUuidQuery,
  useInsertTableDataFromEditorMutation,
} from "@/service/project/projectApi";

interface PageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

const JSONEditor = ({ params }: PageProps) => {
  const [resolvedParams, setResolvedParams] = useState<{
    workspaceId: string;
  } | null>(null);
  console.log("This is a id for project : ", resolvedParams);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const monacoRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState("");
  const [projectUuid, setProjectUuid] = useState("");
  const [tableName, setTableName] = useState("club");

  // Fetch project data using RTK Query
  const {
    data: response,
    error: ree,
    isLoading: isProjectLoading,
  } = useGetProjectByUuidQuery(resolvedParams?.workspaceId, {
    skip: !resolvedParams?.workspaceId,
  });

  // Upload mutation
  const [insertTableData, { isLoading: isUploading, error: uploadError }] =
    useInsertTableDataFromEditorMutation();

  console.log("Data response here : ", response);

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  // Set project UUID when data is fetched
  useEffect(() => {
    if (response && response.uuid) {
      setProjectUuid(response.uuid);
    }
  }, [response]);

  // Load Monaco Editor
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js";
    script.onload = () => {
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
        if (editorRef.current && !monacoRef.current) {
          monacoRef.current = window.monaco.editor.create(editorRef.current, {
            value: `[{"name":"Club A","country":"USA"},{"name":"Club B","country":"Canada"}]`,
            language: "json",
            theme: "vs-dark",
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 2,
          });

          setIsReady(true);
        }
      });
    };
    document.head.appendChild(script);
    return () => {
      if (monacoRef.current) monacoRef.current.dispose();
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  // Auto resize editor
  useEffect(() => {
    const resize = () => monacoRef.current?.layout();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const formatCode = () => {
    if (!monacoRef.current) return;
    try {
      const parsed = JSON.parse(monacoRef.current.getValue());
      monacoRef.current.setValue(JSON.stringify(parsed, null, 2));
    } catch (err) {
      alert("Invalid JSON");
    }
  };

  const clearEditor = () => monacoRef.current?.setValue("");

  const runQuery = async () => {
    if (!monacoRef.current || !projectUuid || !tableName) return;

    try {
      const text = monacoRef.current.getValue();
      const jsonData = JSON.parse(text); // Validate JSON first

      const result = await insertTableData({
        projectUuid,
        schemaName: tableName,
        data: jsonData,
        format: "json",
        trimStrings: true,
        batchSize: 500,
      }).unwrap();

      alert(`Success: ${result.message || "Data uploaded successfully"}`);
      console.log("Upload result:", result);
    } catch (err: any) {
      console.error("Upload error:", err);
      if (err.name === "SyntaxError") {
        alert("Error: Invalid JSON format");
      } else if (err.data) {
        alert(`Error: ${err.data.message || JSON.stringify(err.data)}`);
      } else {
        alert(`Error: ${err.message || "Upload failed"}`);
      }
    }
  };

  if (!resolvedParams || isProjectLoading) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-2"></div>
          Loading project data...
        </div>
      </div>
    );
  }

  if (ree) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center text-red-400">
        <div className="text-center">
          <p>Error loading project data</p>
          <p className="text-sm mt-2">{ree?.message || "Unknown error"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900">
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <button
              onClick={formatCode}
              disabled={!isReady}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white"
            >
              <RefreshCcw className="w-4 h-4" /> Format
            </button>
            <button
              onClick={clearEditor}
              disabled={!isReady}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-gray-400 text-sm">Table:</label>
              <input
                type="text"
                value={tableName}
                onChange={e => setTableName(e.target.value)}
                className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                placeholder="Enter table name"
              />
            </div>
            <span className="text-gray-400 text-sm">
              Project: {response?.name || projectUuid || "Loading..."}
            </span>
            <span className="text-gray-400 text-sm">
              Workspace: {resolvedParams.workspaceId}
            </span>
            <button
              onClick={runQuery}
              disabled={!isReady || !projectUuid || !tableName || isUploading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-semibold disabled:opacity-50"
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
          <div ref={editorRef} className="h-full w-full" />
          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
              <div className="text-center text-gray-400">
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
