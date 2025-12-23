"use client"

import React, { useEffect, useState } from "react"
import type { Book } from "../types/book"
import { Link, useNavigate, useOutletContext } from "react-router-dom"
import { Search, Scan, Library, BookOpen } from "lucide-react"
import { Input } from "../components/ui/Input"
import { Card, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"

const API_URL = import.meta.env.VITE_API_URL

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [recentBooks, setRecentBooks] = useState<Book[]>([])
  const [searchResults, setSearchResults] = useState<Book[]>([])
  const { isLoggedIn, setIsLoggedIn } = useOutletContext(); // Layout에서 전달된 isLoggedIn과 setIsLoggedIn 사용
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn) {
      fetchRecentBooks()
    }
  }, [isLoggedIn])

  const fetchRecentBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/books`)
      const books = await response.json()
      setRecentBooks(books.slice(-6).reverse())
    } catch (error) {
      console.error("Failed to fetch books:", error)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    try {
      const response = await fetch(`${API_URL}/books/search?q=${encodeURIComponent(searchQuery)}`)
      const results = await response.json()
      setSearchResults(results)
    } catch (error) {
      console.error("Search failed:", error)
    }
  }

  const displayBooks = searchResults.length > 0 ? searchResults : recentBooks
  const sectionTitle = searchResults.length > 0 ? "검색 결과" : "최근 등록된 책"

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-balance">나만의 책방을 만들어보세요</h1>
          {!isLoggedIn ? (
            <>
              <p className="text-xl text-muted-foreground mb-8 text-pretty">
                로그인을 통해 모든 기능을 이용해보세요!
              </p>
              <Button onClick={() => navigate("/login")} className="mt-4">
                로그인
              </Button>
            </>
          ) : (
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              바코드 스캔으로 간편하게 책을 등록하고 관리하세요
            </p>
          )}
        </div>
      </section>

      {isLoggedIn && (
        <>
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="책 제목, 저자, ISBN으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </form>

          {/* Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto justify-center items-center">
            <Link to="/scan">
              <Card className="hover:bg-accent/10 transition-colors cursor-pointer h-full">
                <CardContent className="flex flex-col items-center justify-center p-8 gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <Scan className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">책 등록</h3>
                  <p className="text-sm text-muted-foreground text-center">바코드를 스캔하여<br />빠르게 책을 등록하세요</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/bookshelf">
              <Card className="hover:bg-accent/10 transition-colors cursor-pointer h-full">
                <CardContent className="flex flex-col items-center justify-center p-8 gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <Library className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">내 책방</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    카테고리별로 정리된<br />나의 책들을 확인하세요
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent Books Section */}
          <section className="py-16 px-4">
            <div className="container max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">{sectionTitle}</h2>
                {recentBooks.length > 0 && (
                  <Link to="/bookshelf">
                    <Button variant="outline">전체 보기</Button>
                  </Link>
                )}
              </div>

              {displayBooks.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {displayBooks.map((book) => (
                    <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-1">{book.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12">
                  <div className="text-center text-muted-foreground">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">{searchQuery ? "검색 결과가 없습니다" : "등록된 책이 없습니다"}</p>
                    <p className="text-sm mt-2">{!searchQuery && "바코드 스캔으로 첫 번째 책을 등록해보세요"}</p>
                  </div>
                </Card>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
