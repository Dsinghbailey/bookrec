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
    <div className="flex border rounded-lg overflow-hidden">
      <div className="w-[150px] h-[200px] flex-shrink-0">
        <img
          src={book.image_url || "/placeholder.svg"}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-between p-4 w-full">
        <div>
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold">{book.title}</h2>
            <p className="text-gray-600">{book.author}</p>
            <div className="flex items-center">
              <select
                value={book.status}
                onChange={handleStatusChange}
                className="border rounded-md px-2 py-1 text-sm"
              >
                <option value="to-read">To Read</option>
                <option value="finished">Finished</option>
              </select>
            </div>
          </div>
          <p className="mt-2 text-gray-700">{book.reason}</p>
        </div>

        <div className="flex flex-col mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={onReadMore}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Read More
              </button>
              <button
                onClick={() => removeFromBookshelf(book.id)}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
              >
                Remove
              </button>
            </div>

            <div className="flex items-center">
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

          <div></div>
        </div>
      </div>
    </div>
  );
}
