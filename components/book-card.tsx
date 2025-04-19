"use client";

import { Star } from "lucide-react";
import type { Book } from "@/lib/types";

interface BookCardProps {
  book: Book;
  onReadMore: () => void;
  onBookmark: () => void;
  isInBookshelf: boolean;
}

export default function BookCard({
  book,
  onReadMore,
  onBookmark,
  isInBookshelf,
}: BookCardProps) {
  return (
    <div className="flex flex-col sm:flex-row border rounded-lg overflow-hidden">
      <div className="w-full sm:w-[150px] h-[200px] sm:h-[200px] flex-shrink-0">
        <img
          src={book.image_url || "/placeholder.svg"}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-between p-4 w-full">
        <div>
          <h2 className="text-xl font-bold line-clamp-2">{book.title}</h2>
          <p className="text-gray-600 line-clamp-1">{book.author}</p>
          <p className="mt-2 text-gray-700 line-clamp-3">{book.reason}</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-2 sm:gap-4">
          <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={onReadMore}
              className="px-4 py-2 bg-blue-600 text-white rounded-md w-full sm:w-auto"
            >
              Read More
            </button>
            <button
              onClick={onBookmark}
              className={`px-4 py-2 border rounded-md w-full sm:w-auto ${
                isInBookshelf
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
              disabled={isInBookshelf}
            >
              {isInBookshelf ? "Added To Bookshelf" : "Bookmark"}
            </button>
          </div>
          <div className="flex items-center self-end sm:self-auto">
            <Star className="fill-yellow-400 text-yellow-400 h-5 w-5" />
            <span className="ml-1">{book.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
