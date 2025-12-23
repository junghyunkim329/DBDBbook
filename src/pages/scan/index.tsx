"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { Textarea } from "../../components/ui/Textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Camera, Loader2, Check } from "lucide-react"
import { BrowserMultiFormatReader } from "@zxing/library"
import { Html5QrcodeScanner } from "html5-qrcode"
import type { Book } from "../../types/book"

const API_URL = "http://localhost:5000/api"

export default function Scan() {
  const navigate = useNavigate()
  const [isScanning, setIsScanning] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [scannedISBN, setScannedISBN] = useState("")
  const [bookData, setBookData] = useState<Partial<Book>>({
    title: "",
    author: "",
    publisher: "",
    publishedDate: "",
    isbn: "",
    category: "",
    description: "",
    thumbnail: "",
  })

  useEffect(() => {
    if (!isScanning) return // 스캔 중일 때만 실행

    const element = document.getElementById("reader")
    if (!element) {
      console.error("HTML Element with id=reader not found")
      return
    }

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    )

    const successCallback = (decodedText: string) => {
      console.log("Scanned barcode:", decodedText)

      // 스캔한 바코드 데이터를 백엔드로 전송
      fetch("http://localhost:5000/api/barcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode: decodedText }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("도서 정보를 찾을 수 없습니다.")
          }
          return res.json()
        })
        .then((data) => {
          console.log("서버 응답:", data)
          setBookData({
            title: data.title,
            author: data.author,
            publisher: data.publisher,
            isbn: decodedText,
            thumbnail: data.thumbnail || "",
          })
        })
        .catch((err) => {
          console.error("전송 오류:", err)
          alert("도서 정보를 가져오는 데 실패했습니다.")
        })
    }

    const errorCallback = (error: any) => {
      console.warn("바코드 스캔 에러:", error)
    }

    scanner.render(successCallback, errorCallback)

    return () => {
      scanner.clear().catch((error) => console.error("스캐너 해제 오류:", error))
    }
  }, [isScanning]) // isScanning 상태가 변경될 때만 실행

  const startScanning = async () => {
    setIsScanning(true)
    const codeReader = new BrowserMultiFormatReader()

    try {
      const videoInputDevices = await codeReader.listVideoInputDevices()
      if (videoInputDevices.length === 0) {
        alert("카메라를 찾을 수 없습니다")
        setIsScanning(false)
        return
      }

      const result = await codeReader.decodeOnceFromVideoDevice(undefined, "video")

      if (result) {
        const isbn = result.getText()
        setScannedISBN(isbn)
        await fetchBookInfo(isbn)
      }
    } catch (error) {
      console.error("Scanning error:", error)
      alert("바코드 스캔에 실패했습니다")
    } finally {
      codeReader.reset()
      setIsScanning(false)
    }
  }

  const fetchBookInfo = async (isbn: string) => {
    setIsFetching(true)
    try {
      const response = await fetch(`${API_URL}/books/isbn/${isbn}`)
      if (response.ok) {
        const data = await response.json()
        setBookData({
          ...data,
          category: data.categories?.[0] || "",
        })
      } else {
        setBookData({ ...bookData, isbn })
        alert("책 정보를 찾을 수 없습니다. 직접 입력해주세요.")
      }
    } catch (error) {
      console.error("Failed to fetch book info:", error)
      setBookData({ ...bookData, isbn })
      alert("책 정보를 가져오는데 실패했습니다")
    } finally {
      setIsFetching(false)
    }
  }

  const handleManualISBN = async (e: React.FormEvent) => {
    e.preventDefault()
    if (scannedISBN) {
      await fetchBookInfo(scannedISBN)
    }
  }

  const handleSave = async () => {
    if (!bookData.title || !bookData.author) {
      alert("제목과 저자는 필수 입력 항목입니다")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      })

      if (response.ok) {
        alert("책이 성공적으로 등록되었습니다!")
        navigate("/bookshelf")
      } else {
        alert("책 등록에 실패했습니다")
      }
    } catch (error) {
      console.error("Failed to save book:", error)
      alert("책 등록 중 오류가 발생했습니다")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">책 등록</h1>
        <p className="text-muted-foreground">바코드를 스캔하거나 ISBN을 직접 입력하여 책을 등록하세요</p>
      </div>

      <div className="grid gap-8">
        {/* Barcode Scanner Section */}
        <Card>
          <CardHeader>
            <CardTitle>바코드 스캔</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isScanning ? (
              <div className="space-y-4">
                {/* 바코드 스캔을 위한 컨테이너 */}
                <div id="reader" className="w-full rounded-lg bg-black" style={{ maxHeight: "400px" }}></div>
                <Button onClick={() => setIsScanning(false)} variant="outline" className="w-full">
                  취소
                </Button>
              </div>
            ) : (
              <Button onClick={startScanning} className="w-full" size="lg">
                <Camera className="mr-2 h-5 w-5" />
                카메라로 바코드 스캔
              </Button>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">또는</span>
              </div>
            </div>

            <form onSubmit={handleManualISBN} className="space-y-4">
              <div>
                <Label htmlFor="isbn">ISBN 직접 입력</Label>
                <Input
                  id="isbn"
                  type="text"
                  placeholder="ISBN 번호를 입력하세요"
                  value={scannedISBN}
                  onChange={(e) => setScannedISBN(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                variant="outline"
                className="w-full bg-transparent"
                disabled={!scannedISBN || isFetching}
              >
                {isFetching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />책 정보 가져오는 중...
                  </>
                ) : (
                  "책 정보 가져오기"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Book Information Form */}
        {bookData.isbn && (
          <Card>
            <CardHeader>
              <CardTitle>책 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {bookData.thumbnail && (
                <div className="flex justify-center">
                  <img
                    src={bookData.thumbnail || "/placeholder.svg"}
                    alt={bookData.title}
                    className="h-48 object-contain rounded-lg"
                  />
                </div>
              )}

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title">제목 *</Label>
                  <Input
                    id="title"
                    value={bookData.title}
                    onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="author">저자 *</Label>
                  <Input
                    id="author"
                    value={bookData.author}
                    onChange={(e) => setBookData({ ...bookData, author: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="publisher">출판사</Label>
                    <Input
                      id="publisher"
                      value={bookData.publisher}
                      onChange={(e) => setBookData({ ...bookData, publisher: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="publishedDate">출판일</Label>
                    <Input
                      id="publishedDate"
                      value={bookData.publishedDate}
                      onChange={(e) =>
                        setBookData({
                          ...bookData,
                          publishedDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">카테고리</Label>
                  <Input
                    id="category"
                    value={bookData.category}
                    onChange={(e) => setBookData({ ...bookData, category: e.target.value })}
                    placeholder="예: 소설, 자기계발, 컴퓨터"
                  />
                </div>

                <div>
                  <Label htmlFor="description">설명</Label>
                  <Textarea
                    id="description"
                    value={bookData.description}
                    onChange={(e) => setBookData({ ...bookData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>ISBN</Label>
                  <Badge variant="secondary" className="mt-2">
                    {bookData.isbn}
                  </Badge>
                </div>
              </div>

              <Button onClick={handleSave} className="w-full" size="lg" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />책 등록하기
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
