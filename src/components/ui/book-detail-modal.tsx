"use client"

import { useState } from "react"
import { Star, Calendar, Building, Tag, BookOpen, Edit, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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

interface BookDetailModalProps {
  book: BookInfo | null
  isOpen: boolean
  onClose: () => void
  onSave: (book: BookInfo) => void
}

export function BookDetailModal({ book, isOpen, onClose, onSave }: BookDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedBook, setEditedBook] = useState<BookInfo | null>(null)

  const handleEdit = () => {
    setEditedBook(book)
    setIsEditing(true)
  }

  const handleSave = () => {
    if (editedBook) {
      onSave(editedBook)
      setIsEditing(false)
      onClose()
    }
  }

  const handleCancel = () => {
    setEditedBook(null)
    setIsEditing(false)
  }

  const renderStars = (rating?: number, editable = false) => {
    if (!editable) {
      if (!rating) return null
      return (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
          ))}
        </div>
      )
    }

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 cursor-pointer transition-colors ${
              i < (editedBook?.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-200"
            }`}
            onClick={() => setEditedBook((prev) => (prev ? { ...prev, rating: i + 1 } : null))}
          />
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditedBook((prev) => (prev ? { ...prev, rating: 0 } : null))}
          className="ml-2 text-xs korean-text"
        >
          초기화
        </Button>
      </div>
    )
  }

  if (!book) return null

  const currentBook = isEditing ? editedBook : book

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="korean-text">책 상세 정보</span>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={handleEdit} size="sm" className="korean-text">
                  <Edit className="w-4 h-4 mr-2" />
                  편집
                </Button>
              ) : (
                <>
                  <Button onClick={handleSave} size="sm" className="korean-text">
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm" className="korean-text bg-transparent">
                    <X className="w-4 h-4 mr-2" />
                    취소
                  </Button>
                </>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Book Cover */}
          <div className="md:col-span-1">
            <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-muted">
              {currentBook?.image ? (
                <img
                  src={currentBook.image || "/placeholder.svg"}
                  alt={currentBook.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Book Information */}
          <div className="md:col-span-2 space-y-6">
            {/* Title and Author */}
            <div className="space-y-4">
              {isEditing ? (
                <div className="space-y-2">
                  <Label className="korean-text">제목</Label>
                  <Input
                    value={editedBook?.title || ""}
                    onChange={(e) => setEditedBook((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                    className="korean-text"
                  />
                </div>
              ) : (
                <h2 className="text-3xl font-bold text-card-foreground korean-text">{currentBook?.title}</h2>
              )}

              {isEditing ? (
                <div className="space-y-2">
                  <Label className="korean-text">저자</Label>
                  <Input
                    value={editedBook?.author || ""}
                    onChange={(e) => setEditedBook((prev) => (prev ? { ...prev, author: e.target.value } : null))}
                    className="korean-text"
                  />
                </div>
              ) : (
                <p className="text-xl text-muted-foreground korean-text">{currentBook?.author}</p>
              )}
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2 korean-text">
                  <Building className="w-4 h-4" />
                  출판사
                </Label>
                {isEditing ? (
                  <Input
                    value={editedBook?.publisher || ""}
                    onChange={(e) => setEditedBook((prev) => (prev ? { ...prev, publisher: e.target.value } : null))}
                    className="korean-text"
                  />
                ) : (
                  <p className="korean-text">{currentBook?.publisher}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2 korean-text">
                  <Calendar className="w-4 h-4" />
                  출간일
                </Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editedBook?.publishDate || ""}
                    onChange={(e) => setEditedBook((prev) => (prev ? { ...prev, publishDate: e.target.value } : null))}
                  />
                ) : (
                  <p>{currentBook?.publishDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium korean-text">ISBN</Label>
                <p className="font-mono text-sm">{currentBook?.isbn}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2 korean-text">
                  <Tag className="w-4 h-4" />
                  카테고리
                </Label>
                {isEditing ? (
                  <Select
                    value={editedBook?.category || ""}
                    onValueChange={(value) => setEditedBook((prev) => (prev ? { ...prev, category: value } : null))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="컴퓨터과학" className="korean-text">
                        컴퓨터과학
                      </SelectItem>
                      <SelectItem value="프로그래밍" className="korean-text">
                        프로그래밍
                      </SelectItem>
                      <SelectItem value="수학" className="korean-text">
                        수학
                      </SelectItem>
                      <SelectItem value="물리학" className="korean-text">
                        물리학
                      </SelectItem>
                      <SelectItem value="화학" className="korean-text">
                        화학
                      </SelectItem>
                      <SelectItem value="생물학" className="korean-text">
                        생물학
                      </SelectItem>
                      <SelectItem value="경영학" className="korean-text">
                        경영학
                      </SelectItem>
                      <SelectItem value="경제학" className="korean-text">
                        경제학
                      </SelectItem>
                      <SelectItem value="문학" className="korean-text">
                        문학
                      </SelectItem>
                      <SelectItem value="역사" className="korean-text">
                        역사
                      </SelectItem>
                      <SelectItem value="철학" className="korean-text">
                        철학
                      </SelectItem>
                      <SelectItem value="기타" className="korean-text">
                        기타
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="secondary" className="korean-text">
                    {currentBook?.category}
                  </Badge>
                )}
              </div>
            </div>

            {/* Reading Status and Rating */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium korean-text">읽기 상태</Label>
                {isEditing ? (
                  <Select
                    value={editedBook?.readStatus || "읽지않음"}
                    onValueChange={(value: "읽지않음" | "읽는중" | "완독") =>
                      setEditedBook((prev) => (prev ? { ...prev, readStatus: value } : null))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="읽지않음" className="korean-text">
                        읽지않음
                      </SelectItem>
                      <SelectItem value="읽는중" className="korean-text">
                        읽는중
                      </SelectItem>
                      <SelectItem value="완독" className="korean-text">
                        완독
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge
                    className={`korean-text ${
                      currentBook?.readStatus === "완독"
                        ? "bg-green-100 text-green-800"
                        : currentBook?.readStatus === "읽는중"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {currentBook?.readStatus || "읽지않음"}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium korean-text">평점</Label>
                {renderStars(currentBook?.rating, isEditing)}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-medium korean-text">설명</Label>
              {isEditing ? (
                <Textarea
                  value={editedBook?.description || ""}
                  onChange={(e) => setEditedBook((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                  rows={3}
                  className="korean-text"
                />
              ) : (
                <p className="text-muted-foreground korean-text">{currentBook?.description}</p>
              )}
            </div>

            {/* Personal Notes */}
            <div className="space-y-2">
              <Label className="text-sm font-medium korean-text">개인 메모</Label>
              {isEditing ? (
                <Textarea
                  value={editedBook?.notes || ""}
                  onChange={(e) => setEditedBook((prev) => (prev ? { ...prev, notes: e.target.value } : null))}
                  rows={3}
                  placeholder="이 책에 대한 개인적인 생각이나 메모를 작성하세요..."
                  className="korean-text"
                />
              ) : (
                <p className="text-muted-foreground korean-text">{currentBook?.notes || "메모가 없습니다."}</p>
              )}
            </div>

            {/* Dates */}
            {currentBook?.addedDate && (
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground korean-text">
                  추가일: {new Date(currentBook.addedDate).toLocaleDateString("ko-KR")}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
