"use client";

import { useCallback, useState } from "react";
import { Label } from "@/components/ui/label";
import { Copy, AlertTriangle, CircleX, Check } from "lucide-react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { ConfirmProjectDialog } from "@/components/popup/comfirmProjectDialog";
import { useThemeManager } from "@/hooks/use-theme";

const ProjectSettings = () => {
  const [projectName, setProjectName] = useState("");
  const [projectId] = useState("proj_abc123def456");
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { mounted, isDark } = useThemeManager();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard?.writeText(projectId);
      setIsCopied(true);
      console.log("Copied to clipboard:", projectId);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy Project ID", err);
    }
  }, [projectId]);

  const handleUpdate = useCallback(() => {
    console.log("Updating project with name:", projectName);
  }, [projectName]);

  const handleDeleteProject = useCallback((enteredName: string) => {
    console.log("Project deletion confirmed:", enteredName);
    setIsOpen(false);
  }, []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-4xl p-6 pt-12">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-8"></div>
        <div className="space-y-6">
          <div className="h-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6 pt-12">
      <h1 className="mb-8 text-3xl font-semibold text-gray-900 dark:text-white">
        Project Settings
      </h1>

      <section className="mb-12">
        <h2 className="mb-6 text-lg font-medium text-gray-900 dark:text-white">
          General Settings
        </h2>

        <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 font-medium text-gray-900 dark:text-white">
                General
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-400">
                Project name and Project ID uniquely identify this project when
                using Encora services.
              </p>
            </div>

            <div className="space-y-6 min-w-0">
              <div>
                <Label
                  htmlFor="project-name"
                  className="mb-2 block text-sm text-gray-700 dark:text-slate-300"
                >
                  Project name
                </Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="h-10 w-full border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white "
                />
              </div>

              <div>
                <Label
                  htmlFor="project-id"
                  className="mb-2 block text-sm text-gray-700 dark:text-slate-300"
                >
                  Project ID
                </Label>
                <div className="relative">
                  <Input
                    id="project-id"
                    value={projectId}
                    readOnly
                    aria-readonly
                    className="h-10 w-full border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white pr-20 "
                  />
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="absolute right-1 top-1 h-8 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-xs text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
                    aria-label="Copy project ID"
                  >
                    {isCopied ? (
                      <>
                        <Check className="mr-1 h-3 w-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1 h-3 w-3" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-slate-700">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 border-gray-300 dark:border-slate-600 bg-transparent px-4 sm:px-6 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 border-secondary bg-[#00c9b7] px-4 sm:px-6 hover:bg-[#00c9b7]/90 text-black dark:text-white hover:text-black"
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-lg font-medium text-gray-900 dark:text-white">
          Delete Project
        </h2>

        <div className="rounded-lg border border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-950/20 p-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500 dark:text-red-400" />
              <div>
                <h3 className="mb-3 font-medium text-gray-900 dark:text-white">
                  Delete Project
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  This permanently deletes your project and all associated data.
                  Make sure you have backups before proceeding.
                </p>
              </div>
            </div>
          </div>
          <hr className="border-red-200 dark:bg-red-950 m-4" />
          <div className="flex items-start justify-end p-2">
            <Button
              type="button"
              onClick={() => setIsOpen(true)}
              className="border border-red-300 dark:border-red-900 bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-800"
            >
              <CircleX className="mr-2 h-5 w-5" />
              Delete Project
            </Button>
          </div>
        </div>
      </section>

      <ConfirmProjectDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        projectName="my-awesome-project"
        onConfirm={handleDeleteProject}
      />
    </div>
  );
};

export default ProjectSettings;
