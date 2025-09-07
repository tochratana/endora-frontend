"use client"

import type React from "react"

import { Fragment, useState } from "react"
import { Dialog, Transition, Listbox } from "@headlessui/react"
import { X, Upload, ChevronDown, Database } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImportDataModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (file: File, method: string) => void
}

const importMethods = [
  { id: "replace", name: "Replace existing data" },
  { id: "append", name: "Append to existing data" },
  { id: "update", name: "Update existing records" },
]

export function ImportDataModal({ isOpen, onClose, onImport }: ImportDataModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedMethod, setSelectedMethod] = useState(importMethods[0])
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileSelect = (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      // 50MB limit
      alert("File size must be less than 50MB")
      return
    }

    const allowedTypes = ["text/csv", "application/json", ".csv", ".json"]
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()

    if (!allowedTypes.includes(file.type) && !allowedTypes.includes(fileExtension)) {
      alert("Only CSV and JSON files are allowed")
      return
    }

    setSelectedFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleImport = () => {
    if (selectedFile) {
      onImport(selectedFile, selectedMethod.id)
      onClose()
      setSelectedFile(null)
    }
  }

  const handleClose = () => {
    onClose()
    setSelectedFile(null)
    setSelectedMethod(importMethods[0])
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-700 p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Database className="w-6 h-6 dark:text-slate-400 text-gray-600" />
                    <Dialog.Title className="text-xl font-semibold text-gray-600 dark:text-white">Import Data</Dialog.Title>
                  </div>
                  <button
                    onClick={handleClose}
                    className="rounded-lg p-2 text-gray-600 dark:text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* File Upload Area */}
                <div className="mb-8">
                  <div
                    className={cn(
                      "relative border-2 border-dashed rounded-xl p-12 text-center transition-colors",
                      isDragOver || selectedFile
                        ? "border-purple-500 bg-purple-500/5"
                        : "border-slate-600 hover:border-slate-500",
                    )}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <input
                      type="file"
                      accept=".csv,.json"
                      onChange={handleFileInputChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-purple-400" />
                      </div>

                      {selectedFile ? (
                        <div className="text-center">
                          <p className="text-white font-medium mb-1">{selectedFile.name}</p>
                          <p className="text-slate-400 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-white font-medium mb-2">Click to upload or drag and drop</p>
                          <p className="text-slate-400 text-sm">CSV, JSON files up to 50MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Import Method */}
                <div className="mb-8">
                  <label className="block text-white font-medium mb-3">Import Method</label>
                  <Listbox value={selectedMethod} onChange={setSelectedMethod}>
                    <div className="relative">
                      <Listbox.Button className="relative w-full cursor-pointer rounded-lg dark:bg-slate-800 border dark:border-slate-600 py-3 pl-4 pr-10 text-left text-gray-600 dark:text-white hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors">
                        <span className="block truncate">{selectedMethod.name}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ChevronDown className="h-5 w-5 text-gray-600 dark:text-slate-400" />
                        </span>
                      </Listbox.Button>

                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-slate-800 border dark:border-slate-600 py-1 shadow-lg focus:outline-none">
                          {importMethods.map((method) => (
                            <Listbox.Option
                              key={method.id}
                              className={({ active }) =>
                                cn(
                                  "relative cursor-pointer select-none py-3 px-4 transition-colors",
                                  active ? "bg-purple-500/20 dark:text-white text-gray-600" : "text-slate-300",
                                )
                              }
                              value={method}
                            >
                              {({ selected }) => (
                                <span className={cn("block truncate", selected ? "font-medium" : "font-normal")}>
                                  {method.name}
                                </span>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-lg dark:bg-slate-700 text-gray-600 dark:text-white font-medium border-1 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={!selectedFile}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Database className="w-4 h-4" />
                    Import Data
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
