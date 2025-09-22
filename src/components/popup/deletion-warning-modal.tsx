"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, AlertTriangle } from "lucide-react";
import Button from "../ui/button";

interface DeletionWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export function DeletionWarningModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone. All values associate with this field will be lost.",
}: DeletionWarningModalProps) {
  const handleDelete = () => {
    onConfirm();
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-500"
              enterFrom="opacity-0 scale-90 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-300"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-2"
            >
              <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-slate-900 p-8 text-left align-middle shadow-xl transition-all">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Warning Icon */}
                <div className="flex justify-center mb-6">
                  <div className="rounded-full p-3">
                    <AlertTriangle
                      className="h-12 w-12 text-red-500"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                {/* Title */}
                <Dialog.Title className="text-xl font-semibold text-white text-center mb-4">
                  {title}
                </Dialog.Title>

                {/* Message */}
                <p className="text-slate-400 text-center mb-8 leading-relaxed">
                  {message}
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleDelete}
                    className="w-full bg-red-600 hover:bg-red-700 text-white border border-red-600 hover:border-red-700 transition-all duration-200 py-3"
                  >
                    Yes, delete
                  </Button>

                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-600 transition-all duration-200 py-3"
                  >
                    No, cancel
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
