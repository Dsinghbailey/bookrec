"use client"

import type { Book } from "@/lib/types"
import { X } from "lucide-react"

interface BookModalProps {
  book: Book
  isOpen: boolean
  onClose: () => void
}

export default function BookModal({ book, isOpen, onClose }: BookModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">{book.title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">Summary</h3>
          <p className="text-gray-700">{book.summary}</p>
        </div>
      </div>
    </div>
  )
}
