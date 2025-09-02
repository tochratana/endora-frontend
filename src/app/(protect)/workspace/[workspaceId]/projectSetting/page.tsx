"use client";

import { useCallback, useState } from "react";
import { Label } from "@/components/ui/label";
import { Copy, AlertTriangle, CircleX, Check } from "lucide-react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { ConfirmProjectDialog } from "@/components/popup/comfirmProjectDialog";

const ProjectSettings = () => {
  const [projectName, setProjectName] = useState("");
  const [projectId] = useState("proj_abc123def456");
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard?.writeText(projectId);
      setIsCopied(true);
      //todo Optional: replace with your toast system
      console.log("Copied to clipboard:", projectId);
      
      // Reset back to "Copy" after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy Project ID", err);
    }
  }, [projectId]);

  const handleUpdate = useCallback(() => {
    // TODO: replace console with your actual update logic
    console.log("Updating project with name:", projectName);
  }, [projectName]);

  const handleDeleteProject = useCallback((enteredName: string) => {
    // TODO: replace console with your actual delete logic
    console.log("Project deletion confirmed:", enteredName);
    setIsOpen(false);
  }, []);

  return (
    <div className="mx-auto max-w-4xl p-6 pt-12">
      <h1 className="mb-8 text-3xl font-semibold text-white">
        Project Settings
      </h1>

      {/* General Settings */}
      <section className="mb-12">
        <h2 className="mb-6 text-lg font-medium text-white">
          General Settings
        </h2>

        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left: Description */}
            <div>
              <h3 className="mb-3 font-medium text-white">General</h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Project name and Project ID uniquely identify this project when
                using Encora services.
              </p>
            </div>

            {/* Right: Form */}
            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="project-name"
                  className="mb-2 block text-sm text-slate-300"
                >
                  Project name
                </Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="h-10 w-full border-slate-600 bg-slate-900 text-white placeholder:text-slate-500 focus:border-slate-500"
                />
              </div>

              <div>
                <Label
                  htmlFor="project-id"
                  className="mb-2 block text-sm text-slate-300"
                >
                  Project ID
                </Label>
                <div className="relative">
                  <Input
                    id="project-id"
                    value={projectId}
                    readOnly
                    aria-readonly
                    className="h-10 w-full border-slate-600 bg-slate-900 pr-20 text-white"
                  />
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="absolute right-1 top-1 h-8 border-slate-600 bg-slate-800 px-3 text-xs text-slate-300 hover:bg-slate-700 hover:text-white"
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

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 border-slate-600 bg-transparent px-6 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleUpdate}
                  disabled={!projectName.trim()}
                  className="h-10 bg-teal-600 px-6 text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Delete Project */}
      <section>
        <h2 className="mb-6 text-lg font-medium text-white">Delete Project</h2>

        <div className="rounded-lg border border-red-800/30 bg-red-950/20 p-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left: Warning */}
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
              <div>
                <h3 className="mb-3 font-medium text-white">Delete Project</h3>
                <p className="text-sm text-slate-400 whitespace-nowrap">
                  This permanently deletes your project and all associated data.
                  Make sure you have backups before proceeding.
                </p>
              </div>
            </div>
          </div>
          <hr className="bg-red-950 m-4" />
          {/* Right: Delete Button */}
          <div className="flex items-start justify-end p-2">
            <Button
              type="button"
              onClick={() => setIsOpen(true)}
              className="border border-red-900 bg-red-700 text-white hover:bg-red-800"
            >
              <CircleX className="mr-2 h-5 w-5" />
              Delete Project
            </Button>
          </div>
        </div>
      </section>

     
      {/* Confirm Deletion Dialog */}
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


