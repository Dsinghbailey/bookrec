"use client";

import type React from "react";

import { useState } from "react";
import { Star } from "lucide-react";
import { useBookStore, type BookshelfBook } from "@/lib/store";

interface BookshelfCardProps {
  book: BookshelfBook;
  onReadMore: () => void;
}

export default function BookshelfCard({
  book,
  onReadMore,
}: BookshelfCardProps) {
  const { removeFromBookshelf, updateBookStatus, updateUserRating } =
    useBookStore();
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateBookStatus(book.id, e.target.value as "to-read" | "finished");
  };

  const handleRatingClick = (rating: number) => {
    updateUserRating(book.id, rating);
  };

  return (
    <div className="flex flex-col sm:flex-row border rounded-lg overflow-hidden">
      <div className="w-full sm:w-[150px] h-[200px] flex-shrink-0">
        <img
          src={book.image_url || "/placeholder.svg"}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-between p-4 w-full">
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
            <div>
              <h2 className="text-xl font-bold line-clamp-2">{book.title}</h2>
              <p className="text-gray-600 line-clamp-1">{book.author}</p>
            </div>
            <div className="flex items-center">
              <select
                value={book.status}
                onChange={handleStatusChange}
                className="border rounded-md px-2 py-1 text-sm w-full sm:w-auto"
              >
                <option value="to-read">To Read</option>
                <option value="finished">Finished</option>
              </select>
            </div>
          </div>
          <p className="mt-2 text-gray-700 line-clamp-3">{book.reason}</p>
        </div>

        <div className="flex flex-col mt-4 space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                onClick={onReadMore}
                className="px-4 py-2 bg-blue-600 text-white rounded-md w-full sm:w-auto"
              >
                Read More
              </button>
              <button
                onClick={() => removeFromBookshelf(book.id)}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 w-full sm:w-auto"
              >
                Remove
              </button>
            </div>

            <div className="flex items-center self-end sm:self-auto">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  size={20}
                  className={`cursor-pointer ${
                    (
                      hoveredRating !== null
                        ? rating <= hoveredRating
                        : rating <= (book.userRating || 0)
                    )
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onMouseEnter={() => setHoveredRating(rating)}
                  onMouseLeave={() => setHoveredRating(null)}
                  onClick={() => handleRatingClick(rating)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
