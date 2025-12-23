"use client"

import { useState, useEffect } from "react"
import { BookOpen, Grid3X3, List, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { BookCard } from "@/components/book-card"
import { BookDetailModal } from "@/components/book-detail-modal"

interface BookInfo {
  isbn: string
  title: string
  author: string
  publisher: string
  publishDate: string
  category: string
  description: string
  image?: string
  addedDate?: string
  readStatus?: "읽지않음" | "읽는중" | "완독"
  rating?: number
  notes?: string
}

export default function BookshelfPage() {
  const [books, setBooks] = useState<BookInfo[]>([])
  const [filteredBooks, setFilteredBooks] = useState<BookInfo[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [selectedStatus, setSelectedStatus] = useState("전체")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("addedDate")
  const [selectedBook, setSelectedBook] = useState<BookInfo | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()

  // Load books from localStorage on component mount
  useEffect(() => {
    const savedBooks = JSON.parse(localStorage.getItem("myBooks") || "[]")
    // Add some sample books if none exist
    if (savedBooks.length === 0) {
      const sampleBooks: BookInfo[] = [
        {
          isbn: "9788966261024",
          title: "정보보안개론",
          author: "김보안",
          publisher: "한빛미디어",
          publishDate: "2023-03-15",
          category: "컴퓨터과학",
          description: "정보보안의 기초부터 고급 기술까지 체계적으로 다룬 교재입니다.",
          image: "/information-security-textbook-korean.jpg",
          addedDate: "2024-01-15",
          readStatus: "완독",
          rating: 5,
          notes: "매우 유용한 교재였습니다.",
        },
        {
          isbn: "9788968481475",
          title: "C언어 프로그래밍",
          author: "이코딩",
          publisher: "생능출판",
          publishDate: "2023-01-20",
          category: "프로그래밍",
          description: "C언어의 기본 문법부터 실무 활용까지 완벽 가이드입니다.",
          image: "/c-programming-textbook-korean.jpg",
          addedDate: "2024-01-20",
          readStatus: "읽는중",
          rating: 4,
        },
        {
          isbn: "9788970509716",
          title: "미분적분학",
          author: "박수학",
          publisher: "경문사",
          publishDate: "2022-08-10",
          category: "수학",
          description: "공학도를 위한 미분적분학 완전정복 교재입니다.",
          image: "/calculus-mathematics-textbook-korean.jpg",
          addedDate: "2024-02-01",
          readStatus: "읽지않음",
        },
        {
          isbn: "9788970123456",
          title: "이산수학",
          author: "최논리",
          publisher: "경문사",
          publishDate: "2022-05-15",
          category: "수학",
          description: "컴퓨터과학을 위한 이산수학 기초 교재입니다.",
          image: "/discrete-mathematics-textbook-korean.jpg",
          addedDate: "2024-02-05",
          readStatus: "완독",
          rating: 4,
        },
        {
          isbn: "9788970789123",
          title: "Python 프로그래밍",
          author: "김파이썬",
          publisher: "한빛미디어",
          publishDate: "2023-06-10",
          category: "프로그래밍",
          description: "Python 기초부터 실무 프로젝트까지 완벽 가이드입니다.",
          image: "/python-programming-textbook-korean.jpg",
          addedDate: "2024-02-10",
          readStatus: "읽는중",
          rating: 5,
        },
      ]
      localStorage.setItem("myBooks", JSON.stringify(sampleBooks))
      setBooks(sampleBooks)
    } else {
      setBooks(savedBooks)
    }
  }, [])

  // Filter and sort books
  useEffect(() => {
    const filtered = books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "전체" || book.category === selectedCategory

      const matchesStatus = selectedStatus === "전체" || book.readStatus === selectedStatus

      return matchesSearch && matchesCategory && matchesStatus
    })

    // Sort books
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "author":
          return a.author.localeCompare(b.author)
        case "category":
          return a.category.localeCompare(b.category)
        case "addedDate":
          return new Date(b.addedDate || "").getTime() - new Date(a.addedDate || "").getTime()
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        default:
          return 0
      }
    })

    setFilteredBooks(filtered)
  }, [books, searchQuery, selectedCategory, selectedStatus, sortBy])

  const categories = ["전체", ...Array.from(new Set(books.map((book) => book.category)))]
  const statuses = ["전체", "읽지않음", "읽는중", "완독"]

  const handleViewBook = (book: BookInfo) => {
    setSelectedBook(book)
    setIsModalOpen(true)
  }

  const handleEditBook = (book: BookInfo) => {
    setSelectedBook(book)
    setIsModalOpen(true)
  }

  const handleSaveBook = (updatedBook: BookInfo) => {
    const updatedBooks = books.map((book) => (book.isbn === updatedBook.isbn ? updatedBook : book))
    setBooks(updatedBooks)
    localStorage.setItem("myBooks", JSON.stringify(updatedBooks))
    toast({
      title: "책 정보가 업데이트되었습니다",
      description: `${updatedBook.title}의 정보가 저장되었습니다.`,
    })
  }

  const handleDeleteBook = (isbn: string) => {
    const updatedBooks = books.filter((book) => book.isbn !== isbn)
    setBooks(updatedBooks)
    localStorage.setItem("myBooks", JSON.stringify(updatedBooks))
    toast({
      title: "책이 삭제되었습니다",
      description: "선택한 책이 책장에서 제거되었습니다.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background py-8 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2 korean-text">📚 내 책장</h1>
            <p className="text-lg text-muted-foreground korean-text">총 {books.length}권의 책이 있습니다</p>
          </div>
          <Button className="korean-text" asChild>
            <a href="/scan">
              <Plus className="w-4 h-4 mr-2" />책 추가하기
            </a>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {books.filter((book) => book.readStatus === "완독").length}
              </div>
              <div className="text-sm text-muted-foreground korean-text">완독</div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary mb-1">
                {books.filter((book) => book.readStatus === "읽는중").length}
              </div>
              <div className="text-sm text-muted-foreground korean-text">읽는중</div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-muted-foreground mb-1">
                {books.filter((book) => book.readStatus === "읽지않음").length}
              </div>
              <div className="text-sm text-muted-foreground korean-text">읽지않음</div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent mb-1">{categories.length - 1}</div>
              <div className="text-sm text-muted-foreground korean-text">카테고리</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="책 제목, 저자, 카테고리로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 korean-text"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="korean-text">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status} className="korean-text">
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="addedDate" className="korean-text">
                      추가일순
                    </SelectItem>
                    <SelectItem value="title" className="korean-text">
                      제목순
                    </SelectItem>
                    <SelectItem value="author" className="korean-text">
                      저자순
                    </SelectItem>
                    <SelectItem value="category" className="korean-text">
                      카테고리순
                    </SelectItem>
                    <SelectItem value="rating" className="korean-text">
                      평점순
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex border border-border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Books Display */}
        {filteredBooks.length === 0 ? (
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-card-foreground mb-2 korean-text">책을 찾을 수 없습니다</h3>
              <p className="text-muted-foreground korean-text">검색 조건을 변경하거나 새로운 책을 추가해보세요.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.isbn}
                book={book}
                onView={handleViewBook}
                onEdit={handleEditBook}
                onDelete={handleDeleteBook}
              />
            ))}
          </div>
        )}

        {/* Book Detail Modal */}
        <BookDetailModal
          book={selectedBook}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedBook(null)
          }}
          onSave={handleSaveBook}
        />
      </div>
    </div>
  )
}
