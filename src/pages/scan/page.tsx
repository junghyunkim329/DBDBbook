"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, Upload, BookOpen, Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface BookInfo {
  isbn: string
  title: string
  author: string
  publisher: string
  publishDate: string
  category: string
  description: string
  image?: string
}

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedBook, setScannedBook] = useState<BookInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [manualISBN, setManualISBN] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  // Mock book database for demonstration
  const mockBooks: Record<string, BookInfo> = {
    "9788966261024": {
      isbn: "9788966261024",
      title: "정보보안개론",
      author: "김보안",
      publisher: "한빛미디어",
      publishDate: "2023-03-15",
      category: "컴퓨터과학",
      description: "정보보안의 기초부터 고급 기술까지 체계적으로 다룬 교재입니다.",
      image: "/information-security-textbook-korean.jpg",
    },
    "9788968481475": {
      isbn: "9788968481475",
      title: "C언어 프로그래밍",
      author: "이코딩",
      publisher: "생능출판",
      publishDate: "2023-01-20",
      category: "프로그래밍",
      description: "C언어의 기본 문법부터 실무 활용까지 완벽 가이드입니다.",
      image: "/c-programming-textbook-korean.jpg",
    },
    "9788970509716": {
      isbn: "9788970509716",
      title: "미분적분학",
      author: "박수학",
      publisher: "경문사",
      publishDate: "2022-08-10",
      category: "수학",
      description: "공학도를 위한 미분적분학 완전정복 교재입니다.",
      image: "/calculus-mathematics-textbook-korean.jpg",
    },
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsScanning(true)
      }
    } catch (error) {
      toast({
        title: "카메라 접근 실패",
        description: "카메라에 접근할 수 없습니다. 권한을 확인해주세요.",
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }

  const simulateBarcodeScan = () => {
    // Simulate barcode detection after 2 seconds
    setTimeout(() => {
      const randomISBNs = Object.keys(mockBooks)
      const randomISBN = randomISBNs[Math.floor(Math.random() * randomISBNs.length)]
      handleBookFound(randomISBN)
    }, 2000)
  }

  const handleBookFound = async (isbn: string) => {
    setIsLoading(true)
    stopCamera()

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const bookInfo = mockBooks[isbn]
    if (bookInfo) {
      setScannedBook(bookInfo)
      toast({
        title: "책 정보 찾기 성공!",
        description: `${bookInfo.title}을(를) 찾았습니다.`,
      })
    } else {
      toast({
        title: "책 정보를 찾을 수 없습니다",
        description: "다시 시도하거나 수동으로 ISBN을 입력해주세요.",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  const handleManualSearch = () => {
    if (manualISBN.trim()) {
      handleBookFound(manualISBN.trim())
      setManualISBN("")
    }
  }

  const addToBookshelf = () => {
    if (scannedBook) {
      // Here you would typically save to a database or local storage
      const savedBooks = JSON.parse(localStorage.getItem("myBooks") || "[]")
      const bookExists = savedBooks.some((book: BookInfo) => book.isbn === scannedBook.isbn)

      if (!bookExists) {
        savedBooks.push(scannedBook)
        localStorage.setItem("myBooks", JSON.stringify(savedBooks))
        toast({
          title: "책장에 추가됨!",
          description: `${scannedBook.title}이(가) 개인 책장에 추가되었습니다.`,
        })
      } else {
        toast({
          title: "이미 등록된 책입니다",
          description: "이 책은 이미 개인 책장에 있습니다.",
          variant: "destructive",
        })
      }
      setScannedBook(null)
    }
  }

  useEffect(() => {
    if (isScanning) {
      simulateBarcodeScan()
    }
  }, [isScanning])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background py-8 px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4 korean-text">📚 책 바코드 스캔</h1>
          <p className="text-lg text-muted-foreground korean-text">
            바코드를 스캔하거나 ISBN을 입력하여 책을 등록하세요
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Scanner Section */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 korean-text">
                <Camera className="w-5 h-5" />
                바코드 스캐너
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isScanning && !isLoading ? (
                <div className="text-center space-y-4">
                  <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground korean-text">카메라를 시작하여 바코드를 스캔하세요</p>
                    </div>
                  </div>
                  <Button onClick={startCamera} className="w-full korean-text">
                    <Camera className="w-4 h-4 mr-2" />
                    카메라 시작
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <canvas ref={canvasRef} className="hidden" />
                    {isLoading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                          <p className="korean-text">책 정보를 검색중...</p>
                        </div>
                      </div>
                    )}
                    {isScanning && !isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-32 border-2 border-secondary rounded-lg">
                          <div className="w-full h-full border border-secondary/50 rounded-lg animate-pulse" />
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    className="w-full korean-text bg-transparent"
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    스캔 중지
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Manual Input Section */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 korean-text">
                <Upload className="w-5 h-5" />
                수동 입력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="isbn" className="korean-text">
                  ISBN 번호
                </Label>
                <Input
                  id="isbn"
                  placeholder="ISBN을 입력하세요 (예: 9788966261024)"
                  value={manualISBN}
                  onChange={(e) => setManualISBN(e.target.value)}
                  className="korean-text"
                />
              </div>
              <Button
                onClick={handleManualSearch}
                className="w-full korean-text"
                disabled={!manualISBN.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    검색중...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4 mr-2" />책 검색
                  </>
                )}
              </Button>

              <div className="pt-4 border-t border-border">
                <h4 className="font-semibold mb-2 korean-text">테스트용 ISBN</h4>
                <div className="space-y-2">
                  {Object.keys(mockBooks).map((isbn) => (
                    <Button
                      key={isbn}
                      variant="ghost"
                      size="sm"
                      onClick={() => setManualISBN(isbn)}
                      className="w-full justify-start text-xs korean-text"
                    >
                      {isbn} - {mockBooks[isbn].title}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Book Information Display */}
        {scannedBook && (
          <Card className="mt-8 border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 korean-text">
                <BookOpen className="w-5 h-5" />
                찾은 책 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-muted">
                    {scannedBook.image ? (
                      <img
                        src={scannedBook.image || "/placeholder.svg"}
                        alt={scannedBook.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-card-foreground mb-2 korean-text">{scannedBook.title}</h3>
                    <p className="text-lg text-muted-foreground korean-text">{scannedBook.author}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium korean-text">출판사</Label>
                      <p className="korean-text">{scannedBook.publisher}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium korean-text">출간일</Label>
                      <p className="korean-text">{scannedBook.publishDate}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium korean-text">ISBN</Label>
                      <p className="font-mono">{scannedBook.isbn}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium korean-text">카테고리</Label>
                      <Badge variant="secondary" className="korean-text">
                        {scannedBook.category}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium korean-text">설명</Label>
                    <p className="text-muted-foreground korean-text">{scannedBook.description}</p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={addToBookshelf} className="flex-1 korean-text">
                      <Check className="w-4 h-4 mr-2" />내 책장에 추가
                    </Button>
                    <Button variant="outline" onClick={() => setScannedBook(null)} className="korean-text">
                      <X className="w-4 h-4 mr-2" />
                      취소
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
