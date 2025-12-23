"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import Pagination from "../../components/Pagination"
import { Loader2 } from "lucide-react"

interface BookItem {
  id: string
  title: string
  author?: string
  publisher?: string
  isbn?: string
  thumbnail?: string
}

export default function AllBooks() {
  const [books, setBooks] = useState<BookItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const pageSize = 10

  useEffect(() => {
    fetchBooks(currentPage)
  }, [currentPage])

  const fetchBooks = async (page: number) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `http://localhost:5000/api/books/search?q=&page=${page}&pageSize=${pageSize}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch books")
      }

      const data = await response.json()

      // Adjust based on actual API response structure
      setBooks(data || [])
      setTotalPages(Math.ceil((data.total || 100) / pageSize)) // Replace `100` with actual total count if available
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (loading && books.length === 0) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">오류 발생</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={() => fetchBooks(currentPage)} className="mt-4">
              다시 시도
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">전체 책 보기</h1>
        <p className="text-muted-foreground">국립중앙도서관 도서 목록</p>
      </div>

      {books.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">표시할 항목이 없습니다.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                  {book.thumbnail ? (
                    <img
                      src={book.thumbnail || "/placeholder.svg"}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <span className="text-6xl">📚</span>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-base line-clamp-2">{book.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {book.author && <p className="text-sm text-muted-foreground mb-1">{book.author}</p>}
                  {book.publisher && (
                    <p className="text-xs text-muted-foreground line-clamp-1">{book.publisher}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  )
}