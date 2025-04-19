"use client";

import { useState, useEffect } from "react";
import { Send, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import BookCard from "@/components/book-card";
import BookModal from "@/components/book-modal";
import LoadingSpinner from "@/components/loading-spinner";
import { useBookStore } from "@/lib/store";
import type { Book } from "@/lib/types";

export default function Home() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("rating_desc");
  const [triggerSearch, setTriggerSearch] = useState(false);
  const { addToBookshelf, isInBookshelf } = useBookStore();

  useEffect(() => {
    if (triggerSearch && searchInput.trim()) {
      handleSearch();
      setTriggerSearch(false);
    }
  }, [searchInput, triggerSearch]);

  const handleSearch = async () => {
    if (!searchInput.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/book-recs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchInput }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch book recommendations");
      }

      const data = await response.json();

      // Sort the results immediately after receiving them
      const sortedBooks = [...data];
      switch (sortBy) {
        case "title_asc":
          sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "title_desc":
          sortedBooks.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case "author_asc":
          sortedBooks.sort((a, b) => a.author.localeCompare(b.author));
          break;
        case "author_desc":
          sortedBooks.sort((a, b) => b.author.localeCompare(a.author));
          break;
        case "rating_desc":
          sortedBooks.sort((a, b) => {
            const ratingA = a.rating === "unknown" ? 0 : parseFloat(a.rating);
            const ratingB = b.rating === "unknown" ? 0 : parseFloat(b.rating);
            return ratingB - ratingA;
          });
          break;
        case "rating_asc":
          sortedBooks.sort((a, b) => {
            const ratingA = a.rating === "unknown" ? 0 : parseFloat(a.rating);
            const ratingB = b.rating === "unknown" ? 0 : parseFloat(b.rating);
            return ratingA - ratingB;
          });
          break;
      }

      setBooks(sortedBooks);
    } catch (error) {
      console.error("Error fetching book recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    const sortedBooks = [...books];
    switch (value) {
      case "title_asc":
        sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title_desc":
        sortedBooks.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "author_asc":
        sortedBooks.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case "author_desc":
        sortedBooks.sort((a, b) => b.author.localeCompare(a.author));
        break;
      case "rating_desc":
        sortedBooks.sort((a, b) => {
          const ratingA = a.rating === "unknown" ? 0 : parseFloat(a.rating);
          const ratingB = b.rating === "unknown" ? 0 : parseFloat(b.rating);
          return ratingB - ratingA;
        });
        break;
      case "rating_asc":
        sortedBooks.sort((a, b) => {
          const ratingA = a.rating === "unknown" ? 0 : parseFloat(a.rating);
          const ratingB = b.rating === "unknown" ? 0 : parseFloat(b.rating);
          return ratingA - ratingB;
        });
        break;
    }
    setBooks(sortedBooks);
  };

  const handleReadMore = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleBookmark = (book: Book) => {
    addToBookshelf(book);
    console.log("bookmarked", book.id);
  };

  return (
    <main className="min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold text-blue-600">BookRec</h1>
        <button
          onClick={() => router.push("/bookshelf")}
          className="px-4 py-2 border rounded-md flex items-center"
        >
          <span className="mr-2">My Bookshelf</span>
        </button>
      </nav>

      {/* Search Section */}
      <div className="max-w-3xl mx-auto mt-8 px-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Describe the book you're looking for...."
            className="w-full p-3 border rounded-md pr-12"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white p-2 rounded-md"
              aria-label="Search"
              disabled={isLoading}
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        {/* Filter Options */}
        <div className="flex gap-2 mt-4">
          <div className="relative">
            <label
              htmlFor="sort-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sort by
            </label>
            <div className="relative inline-block w-full">
              <select
                id="sort-select"
                className="appearance-none w-full border rounded-md px-4 py-2 pr-8 bg-white"
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="rating_desc">Rating High-Low</option>
                <option value="rating_asc">Rating Low-High</option>
                <option value="title_asc">Title A-Z</option>
                <option value="title_desc">Title Z-A</option>
                <option value="author_asc">Author A-Z</option>
                <option value="author_desc">Author Z-A</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-700">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Book Cards */}
      <div className="max-w-3xl mx-auto mt-8 px-4 space-y-4">
        {isLoading ? (
          <LoadingSpinner />
        ) : books.length > 0 ? (
          books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onReadMore={() => handleReadMore(book)}
              onBookmark={() => handleBookmark(book)}
              isInBookshelf={isInBookshelf(book.id)}
            />
          ))
        ) : (
          <div className="text-center text-gray-500">
            <div className="max-w-2xl mx-auto">
              <p className="text-gray-600 mb-6  mt-10">
                Enter a description of what you're looking for, or try one of
                these examples:
              </p>

              <div className="space-y-6">
                {/* Fiction Categories */}
                <div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => {
                        setSearchInput(
                          "A heartwarming romance set in a small town"
                        );
                        setTriggerSearch(true);
                      }}
                      className="text-sm px-3 py-1 border rounded-full hover:bg-gray-100 transition-colors"
                    >
                      Small town romance
                    </button>
                    <button
                      onClick={() => {
                        setSearchInput(
                          "Science fiction books about time travel"
                        );
                        setTriggerSearch(true);
                      }}
                      className="text-sm px-3 py-1 border rounded-full hover:bg-gray-100 transition-colors"
                    >
                      Time travel sci-fi
                    </button>
                    <button
                      onClick={() => {
                        setSearchInput("Mystery novels with female detectives");
                        setTriggerSearch(true);
                      }}
                      className="text-sm px-3 py-1 border rounded-full hover:bg-gray-100 transition-colors"
                    >
                      Female detective mysteries
                    </button>
                    <button
                      onClick={() => {
                        setSearchInput(
                          "Epic fantasy series with complex magic systems"
                        );
                        setTriggerSearch(true);
                      }}
                      className="text-sm px-3 py-1 border rounded-full hover:bg-gray-100 transition-colors"
                    >
                      Epic fantasy
                    </button>
                  </div>
                </div>

                {/* Non-Fiction Categories */}
                <div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => {
                        setSearchInput("Books that deal with climate change");
                        setTriggerSearch(true);
                      }}
                      className="text-sm px-3 py-1 border rounded-full hover:bg-gray-100 transition-colors"
                    >
                      Climate change
                    </button>
                    <button
                      onClick={() => {
                        setSearchInput(
                          "Biographies of influential women in history"
                        );
                        setTriggerSearch(true);
                      }}
                      className="text-sm px-3 py-1 border rounded-full hover:bg-gray-100 transition-colors"
                    >
                      Women's biographies
                    </button>
                    <button
                      onClick={() => {
                        setSearchInput(
                          "Books about artificial intelligence and its impact on society"
                        );
                        setTriggerSearch(true);
                      }}
                      className="text-sm px-3 py-1 border rounded-full hover:bg-gray-100 transition-colors"
                    >
                      AI & society
                    </button>
                    <button
                      onClick={() => {
                        setSearchInput("Personal finance books for beginners");
                        setTriggerSearch(true);
                      }}
                      className="text-sm px-3 py-1 border rounded-full hover:bg-gray-100 transition-colors"
                    >
                      Personal finance
                    </button>
                  </div>
                </div>

                {/* Reading Mood */}
                <div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => {
                        setSearchInput(
                          "Books that will make me laugh out loud"
                        );
                        setTriggerSearch(true);
                      }}
                      className="text-sm px-3 py-1 border rounded-full hover:bg-gray-100 transition-colors"
                    >
                      Funny books
                    </button>
                    <button
                      onClick={() => {
                        setSearchInput(
                          "Thought-provoking books about human nature"
                        );
                        setTriggerSearch(true);
                      }}
                      className="text-sm px-3 py-1 border rounded-full hover:bg-gray-100 transition-colors"
                    >
                      Thought-provoking
                    </button>
                    <button
                      onClick={() => {
                        setSearchInput("Books that are impossible to put down");
                        setTriggerSearch(true);
                      }}
                      className="text-sm px-3 py-1 border rounded-full hover:bg-gray-100 transition-colors"
                    >
                      Page-turners
                    </button>
                    <button
                      onClick={() => {
                        setSearchInput(
                          "Books that will restore my faith in humanity"
                        );
                        setTriggerSearch(true);
                      }}
                      className="text-sm px-3 py-1 border rounded-full hover:bg-gray-100 transition-colors"
                    >
                      Uplifting stories
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
