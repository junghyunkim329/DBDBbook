"use client"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Card, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Search, Grid3x3, List, BookOpen, Trash2, Filter } from "lucide-react"
import type { Book } from "../../types/book"

const API_URL = "http://localhost:5000/api"

export default function Bookshelf() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"recent" | "title" | "author">("recent")

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    filterAndSortBooks()
  }, [books, searchQuery, selectedCategory, sortBy])

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/books`)
      const data = await response.json()
      setBooks(data)
    } catch (error) {
      console.error("Failed to fetch books:", error)
    }
  }

  const filterAndSortBooks = () => {
    let result = [...books]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (book) =>
          book.title?.toLowerCase().includes(query) ||
          book.author?.toLowerCase().includes(query) ||
          book.isbn?.toLowerCase().includes(query),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((book) => book.category === selectedCategory)
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return (a.title || "").localeCompare(b.title || "")
        case "author":
          return (a.author || "").localeCompare(b.author || "")
        case "recent":
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      }
    })

    setFilteredBooks(result)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("이 책을 삭제하시겠습니까?")) return

    try {
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setBooks(books.filter((book) => book.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete book:", error)
      alert("책 삭제에 실패했습니다")
    }
  }

  const categories = ["all", ...new Set(books.map((book) => book.category).filter(Boolean))]

  return (
    <div className="container max-w-7xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">내 책장</h1>
        <p className="text-muted-foreground">총 {filteredBooks.length}권의 책이 있습니다</p>
      </div>

      {/* Filters and Controls */}
      <div className="space-y-4 mb-8">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="책 제목, 저자, ISBN으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter and View Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === "all" ? "전체" : category}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="recent">최근 등록순</option>
              <option value="title">제목순</option>
              <option value="author">저자순</option>
            </select>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Books Display */}
      {filteredBooks.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="aspect-[2/3] bg-muted relative">
                  {book.thumbnail ? (
                    <img
                      src={book.thumbnail || "/placeholder.svg"}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(book.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1">{book.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{book.author}</p>
                  {book.category && (
                    <Badge variant="secondary" className="text-xs">
                      {book.category}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="w-24 h-36 bg-muted rounded flex-shrink-0">
                      {book.thumbnail ? (
                        <img
                          src={book.thumbnail || "/placeholder.svg"}
                          alt={book.title}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{book.title}</h3>
                          <p className="text-muted-foreground">{book.author}</p>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(book.id!)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {book.category && <Badge variant="secondary">{book.category}</Badge>}
                        {book.publisher && <Badge variant="outline">{book.publisher}</Badge>}
                        {book.publishedDate && <Badge variant="outline">{book.publishedDate}</Badge>}
                      </div>
                      {book.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{book.description}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">
              {searchQuery || selectedCategory !== "all" ? "검색 결과가 없습니다" : "등록된 책이 없습니다"}
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
