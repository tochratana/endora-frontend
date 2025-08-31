// "use client"

// import { useEffect, useRef, useState } from "react"
// import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
// import { CircleX } from "lucide-react"
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// import { toast } from "sonner"
// import Input from "../ui/input"
// import Button from "../ui/button"

// interface ConfirmProjectDialogProps {
//   isOpen: boolean
//   onClose: () => void
//   projectName: string
//   onConfirm: (enteredName: string) => Promise<void> | void
// }

// export function ConfirmProjectDialog({
//   isOpen,
//   onClose,
//   projectName,
//   onConfirm,
// }: ConfirmProjectDialogProps) {
//   const [enteredName, setEnteredName] = useState("")
//   const [loading, setLoading] = useState(false)
//   const inputRef = useRef<HTMLInputElement>(null)

//   // focus the input when the dialog opens (what you called "located khos" → focus)
//   useEffect(() => {
//     if (isOpen) {
//       // small delay lets the dialog mount before focusing
//       setTimeout(() => {
//         inputRef.current?.focus()
//         inputRef.current?.select()
//       }, 0)
//     }
//   }, [isOpen])

//   const isValid = enteredName.trim() === projectName.trim()

//   const handleConfirm = async () => {
//     if (loading) return
//     if (!isValid) {
//       toast.error("Project name does not match.")
//       inputRef.current?.focus()
//       return
//     }

//     try {
//       setLoading(true)
//       await onConfirm(enteredName.trim()) // perform delete
//       toast.success(`Project "${projectName}" deleted successfully!`)
//       setEnteredName("")
//       onClose()
//     } catch {
//       toast.error("Failed to delete project. Try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleClose = () => {
//     setEnteredName("")
//     onClose()
//   }

//   return (
//     <Dialog
//       open={isOpen}
//       onOpenChange={(open) => {
//         if (!open) {
//           handleClose()
//         }
//       }}
//     >
//       <DialogContent className="w-full max-w-2xl bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-800">
//         {/* Header */}
//         <div className="mb-8">
//           <DialogTitle className="text-2xl font-semibold text-white mb-2">
//             Confirm Project Deletion
//           </DialogTitle>
//           <p className="text-slate-400 text-base">
//             Enter your project name to confirm deletion.
//           </p>
//         </div>

//         {/* Input */}
//         <div className="mb-8">
//           <div className="flex items-center gap-8">
//             <label
//               htmlFor="project-name"
//               className="text-white font-medium text-lg min-w-fit"
//             >
//               Project name
//             </label>
//             <Input
//               id="project-name"
//               ref={inputRef}
//               type="text"
//               placeholder={projectName}
//               value={enteredName}
//               onChange={(e) => setEnteredName(e.target.value)}
//               className={`flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-600 focus:ring-slate-600 h-12 text-base ${enteredName && !isValid ? "border-red-600" : ""}`}
//               autoComplete="off"
//             />
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex items-start justify-end">
//           <Button
//             type="button"
//             onClick={handleConfirm}
//             disabled={loading}
//             className="border border-red-900 bg-red-700 text-white hover:bg-red-800 disabled:opacity-50"
//           >
//             <CircleX className="mr-2 h-5 w-5" />
//             {loading ? "Deleting..." : "Delete Project"}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }
"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { CircleX } from "lucide-react"
import { toast } from "sonner"
import Input from "../ui/input"
import Button from "../ui/button"

interface ConfirmProjectDialogProps {
  isOpen: boolean
  onClose: () => void
  projectName: string
  onConfirm: (enteredName: string) => Promise<void> | void
}

export function ConfirmProjectDialog({
  isOpen,
  onClose,
  projectName,
  onConfirm,
}: ConfirmProjectDialogProps) {
  const [enteredName, setEnteredName] = useState("")
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // focus the input when the dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 100)
    }
  }, [isOpen])

  const isValid = enteredName.trim() === projectName.trim()

  const handleConfirm = async () => {
    if (loading) return
    if (!isValid) {
      toast.error("Project name does not match.")
      inputRef.current?.focus()
      return
    }

    try {
      setLoading(true)
      await onConfirm(enteredName.trim())
      toast.success(`Project "${projectName}" deleted successfully!`)
      setEnteredName("")
      onClose()
    } catch {
      toast.error("Failed to delete project. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setEnteredName("")
    onClose()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose()
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
            Type <span className="text-white font-mono bg-slate-800 px-2 py-1 rounded">{projectName}</span> to confirm deletion.
          </p>
        </div>

        {/* Input */}
        <div className="mb-6 space-y-3">
          <label htmlFor="project-name" className="text-slate-300 font-medium text-md">
            Project name
          </label>
          <Input
            id="project-name"
            ref={inputRef}
            type="text"
            placeholder={projectName}
            value={enteredName}
            onChange={(e) => setEnteredName(e.target.value)}
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
  )
}