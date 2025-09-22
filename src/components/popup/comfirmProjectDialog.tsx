"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CircleX } from "lucide-react";
import { toast } from "sonner";
import Input from "../ui/input";
import Button from "../ui/button";

interface ConfirmProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  onConfirm: (enteredName: string) => Promise<void> | void;
}

export function ConfirmProjectDialog({
  isOpen,
  onClose,
  projectName,
  onConfirm,
}: ConfirmProjectDialogProps) {
  const [enteredName, setEnteredName] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // focus the input when the dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen]);

  const isValid = enteredName.trim() === projectName.trim();

  const handleConfirm = async () => {
    if (loading) return;
    if (!isValid) {
      toast.error("Project name does not match.");
      inputRef.current?.focus();
      return;
    }

    try {
      setLoading(true);
      await onConfirm(enteredName.trim());
      toast.success(`Project "${projectName}" deleted successfully!`);
      setEnteredName("");
      onClose();
    } catch {
      toast.error("Failed to delete project. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEnteredName("");
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="w-full max-w-md bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-700">
        {/* Header */}
        <div className="mb-6">
          <DialogTitle className="text-xl font-semibold text-white mb-2">
            Delete Project
          </DialogTitle>
          <p className="text-slate-400">
            Type{" "}
            <span className="text-white font-mono bg-slate-800 px-2 py-1 rounded">
              {projectName}
            </span>{" "}
            to confirm deletion.
          </p>
        </div>

        {/* Input */}
        <div className="mb-6 space-y-3">
          <label
            htmlFor="project-name"
            className="text-slate-300 font-medium text-md"
          >
            Project name
          </label>
          <Input
            id="project-name"
            ref={inputRef}
            type="text"
            placeholder={projectName}
            value={enteredName}
            onChange={e => setEnteredName(e.target.value)}
            className={`w-full bg-slate-800 border mt-4 text-white placeholder:text-slate-500 focus:border-slate-500 h-11 rounded-lg transition-colors ${
              enteredName && !isValid
                ? "border-red-500 focus:border-red-400"
                : "border-slate-600 hover:border-slate-500"
            }`}
            autoComplete="off"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white disabled:opacity-50 h-10 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading || !isValid}
            className={`flex-1 h-10 rounded-lg transition-all duration-200 ${
              !isValid
                ? "bg-slate-700 border border-slate-600 text-slate-500 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white border border-red-500 shadow-lg hover:shadow-red-500/25"
            }`}
          >
            <CircleX className="mr-2 h-4 w-4 " />
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
