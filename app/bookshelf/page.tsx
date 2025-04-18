"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import BookModal from "@/components/book-modal";
import BookshelfCard from "@/components/bookshelf-card";
import { useBookStore } from "@/lib/store";
import type { Book } from "@/lib/types";

export default function Bookshelf() {
  const router = useRouter();
  const { bookshelfBooks } = useBookStore();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toReadBooks = bookshelfBooks.filter(
    (book) => book.status === "to-read"
  );
  const finishedBooks = bookshelfBooks.filter(
    (book) => book.status === "finished"
  );

  const handleReadMore = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="flex justify-between items-center p-4 border-b">
        <h1
          className="text-2xl font-bold text-blue-600 cursor-pointer"
          onClick={() => router.push("/")}
        >
          BookRec
        </h1>
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-blue-600"
        >
          <ChevronLeft size={20} />
          <span>Back to BookRec</span>
        </button>
      </nav>

      {/* Bookshelf Title */}
      <div className="max-w-3xl mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold">Bookshelf</h1>
      </div>

      {/* To Read Section */}
      <div className="max-w-3xl mx-auto mt-8 px-4">
        <h2 className="text-2xl font-semibold mb-4">To Read</h2>
        {toReadBooks.length === 0 ? (
          <p className="text-gray-500 italic">
            No books in your to-read list yet.
          </p>
        ) : (
          <div className="space-y-4">
            {toReadBooks.map((book) => (
              <BookshelfCard
                key={book.id}
                book={book}
                onReadMore={() => handleReadMore(book)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Finished Section */}
      <div className="max-w-3xl mx-auto mt-8 px-4 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Finished</h2>
        {finishedBooks.length === 0 ? (
          <p className="text-gray-500 italic">No finished books yet.</p>
        ) : (
          <div className="space-y-4">
            {finishedBooks.map((book) => (
              <BookshelfCard
                key={book.id}
                book={book}
                onReadMore={() => handleReadMore(book)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Book Modal */}
      {selectedBook && (
        <BookModal
          book={selectedBook}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </main>
  );
}
