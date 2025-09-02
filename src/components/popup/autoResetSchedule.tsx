"use client"

import { Fragment, useState } from "react"
import { Dialog, Transition, Listbox } from "@headlessui/react"
import { X, ChevronDown, Calendar, Edit3, AlertTriangle } from "lucide-react"
import Button from "../ui/button"

interface ScheduleAutoResetModalProps {
  isOpen: boolean
  onClose: () => void
}

const resetOptions = [
  { id: 1, name: "Daily Reset" },
  { id: 2, name: "Weekly Reset" },
  { id: 3, name: "Monthly Reset" },
  { id: 4, name: "Custom Schedule" },
]

export function ScheduleAutoResetModal({ isOpen, onClose }: ScheduleAutoResetModalProps) {
  const [selectedReset, setSelectedReset] = useState(resetOptions[0])

  const handleSetSchedule = () => {
    // Handle set schedule logic
    console.log("Setting schedule:", selectedReset)
    onClose()
  }

  const handleSave = () => {
    // Handle save logic
    console.log("Saving configuration:", selectedReset)
    onClose()
  }

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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-slate-900 p-6 text-left align-middle shadow-xl transition-all border border-slate-700">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-slate-400" />
                    <Dialog.Title className="text-lg font-medium text-white">Schedule Auto Reset</Dialog.Title>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors duration-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Reset Method Section */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-300 mb-3">Reset Method</h3>

                  <Listbox value={selectedReset} onChange={setSelectedReset}>
                    <div className="relative">
                      <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-slate-800 border border-slate-700 py-3 pl-4 pr-10 text-left text-slate-300 hover:bg-slate-750 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200">
                        <span className="block truncate">{selectedReset?.name || "Select Schedule Reset"}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200" />
                        </span>
                      </Listbox.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 scale-95 translate-y-1"
                        enterTo="opacity-100 scale-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 scale-100 translate-y-0"
                        leaveTo="opacity-0 scale-95 translate-y-1"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-slate-800 border border-slate-700 py-1 shadow-lg focus:outline-none">
                          {resetOptions.map((option) => (
                            <Listbox.Option
                              key={option.id}
                              className={({ active }) =>
                                `relative cursor-pointer select-none py-2 px-4 transition-colors duration-150 ${
                                  active ? "bg-purple-600 text-white" : "text-slate-300"
                                }`
                              }
                              value={option}
                            >
                              {({ selected }) => (
                                <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                  {option.name}
                                </span>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>

                {/* Warning Message */}
                <div className="mb-6 rounded-lg border border-red-600/50 bg-red-900/20 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-300">
                        <span className="font-medium">Important:</span> This will restore your original dataset and
                        remove any data added through API calls. Perfect for keeping your test environment fresh.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent transition-all duration-200"
                  >
                    Cancel
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleSetSchedule}
                      className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 transition-all duration-200 hover:scale-105"
                    >
                      <Calendar className="h-4 w-4" />
                      Set Schedule
                    </Button>

                    <Button
                      onClick={handleSave}
                      className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 transition-all duration-200 hover:scale-105"
                    >
                      <Edit3 className="h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
