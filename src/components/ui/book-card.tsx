"use client"

import { Star, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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

interface BookCardProps {
  book: BookInfo
  onView: (book: BookInfo) => void
  onEdit: (book: BookInfo) => void
  onDelete: (isbn: string) => void
}

export function BookCard({ book, onView, onEdit, onDelete }: BookCardProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "완독":
        return "bg-green-100 text-green-800"
      case "읽는중":
        return "bg-blue-100 text-blue-800"
      case "읽지않음":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-3 h-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  return (
    <Card className="hover-lift cursor-pointer border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden group">
      <div className="aspect-[3/4] relative overflow-hidden" onClick={() => onView(book)}>
        <img
          src={book.image || "/placeholder.svg"}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className={`absolute top-2 right-2 ${getStatusColor(book.readStatus)} korean-text`}>
          {book.readStatus || "읽지않음"}
        </Badge>
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                <Edit className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onView(book)} className="korean-text">
                <Eye className="w-4 h-4 mr-2" />
                상세보기
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(book)} className="korean-text">
                <Edit className="w-4 h-4 mr-2" />
                편집
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive korean-text" onClick={() => onDelete(book.isbn)}>
                <Trash2 className="w-4 h-4 mr-2" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="p-4" onClick={() => onView(book)}>
        <h4 className="font-semibold text-card-foreground mb-1 text-sm korean-text line-clamp-2">{book.title}</h4>
        <p className="text-xs text-muted-foreground mb-2 korean-text">{book.author}</p>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs korean-text">
            {book.category}
          </Badge>
          {renderStars(book.rating)}
        </div>
        {book.addedDate && (
          <p className="text-xs text-muted-foreground korean-text">
            추가일: {new Date(book.addedDate).toLocaleDateString("ko-KR")}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
