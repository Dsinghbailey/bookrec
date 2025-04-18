import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Book } from "@/lib/types"

export type BookshelfBook = Book & {
  status: "to-read" | "finished"
  userRating: number | null
}

interface BookStore {
  bookshelfBooks: BookshelfBook[]
  addToBookshelf: (book: Book) => void
  removeFromBookshelf: (bookId: number) => void
  updateBookStatus: (bookId: number, status: "to-read" | "finished") => void
  updateUserRating: (bookId: number, rating: number) => void
  isInBookshelf: (bookId: number) => boolean
}

export const useBookStore = create<BookStore>()(
  persist(
    (set, get) => ({
      bookshelfBooks: [],

      addToBookshelf: (book: Book) => {
        const { bookshelfBooks } = get()
        if (!bookshelfBooks.some((b) => b.id === book.id)) {
          set({
            bookshelfBooks: [...bookshelfBooks, { ...book, status: "to-read", userRating: null }],
          })
        }
      },

      removeFromBookshelf: (bookId: number) => {
        const { bookshelfBooks } = get()
        set({
          bookshelfBooks: bookshelfBooks.filter((book) => book.id !== bookId),
        })
      },

      updateBookStatus: (bookId: number, status: "to-read" | "finished") => {
        const { bookshelfBooks } = get()
        set({
          bookshelfBooks: bookshelfBooks.map((book) => (book.id === bookId ? { ...book, status } : book)),
        })
      },

      updateUserRating: (bookId: number, rating: number) => {
        const { bookshelfBooks } = get()
        set({
          bookshelfBooks: bookshelfBooks.map((book) => (book.id === bookId ? { ...book, userRating: rating } : book)),
        })
      },

      isInBookshelf: (bookId: number) => {
        const { bookshelfBooks } = get()
        return bookshelfBooks.some((book) => book.id === bookId)
      },
    }),
    {
      name: "bookshelf-storage",
    },
  ),
)
