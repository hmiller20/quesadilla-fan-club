import React from 'react'

interface ConfirmDialogProps {
  open: boolean
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ open, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-2 relative">
        <div className="mb-6 text-center text-lg font-medium">{message}</div>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 focus:outline-none"
            onClick={onConfirm}
          >
            Yes, proceed
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none"
            onClick={onCancel}
          >
            No, go back
          </button>
        </div>
      </div>
    </div>
  )
} 