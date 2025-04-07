"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Upload, Download, Copy, FileText } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"

export default function MarkdownToWordConverter() {
  const [markdownContent, setMarkdownContent] = useState<string>(`# Welcome to Markdown to Word Converter!

## Getting Started

This tool helps you convert **Markdown** to *Word documents* while preserving formatting.

### Features

- Real-time preview
- Export to Word (.docx)
- Copy as rich text
- Side-by-side comparison

#### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

> Easily create professional documents from your Markdown content.

[Visit our GitHub repository](https://github.com/example/markdown-to-word)

---

1. Write or paste Markdown
2. Preview the formatting
3. Export as Word document

Enjoy using the converter!`)
  const [activeTab, setActiveTab] = useState<string>("paste")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const markdownPreviewRef = useRef<HTMLDivElement>(null)
  const wordPreviewRef = useRef<HTMLDivElement>(null)

  // Synchronize scrolling between the two preview panes
  useEffect(() => {
    const markdownPreview = markdownPreviewRef.current
    const wordPreview = wordPreviewRef.current

    if (!markdownPreview || !wordPreview) return

    const handleMarkdownScroll = () => {
      if (!markdownPreview || !wordPreview) return
      const scrollPercentage = markdownPreview.scrollTop / (markdownPreview.scrollHeight - markdownPreview.clientHeight)
      wordPreview.scrollTop = scrollPercentage * (wordPreview.scrollHeight - wordPreview.clientHeight)
    }

    const handleWordScroll = () => {
      if (!markdownPreview || !wordPreview) return
      const scrollPercentage = wordPreview.scrollTop / (wordPreview.scrollHeight - wordPreview.clientHeight)
      markdownPreview.scrollTop = scrollPercentage * (markdownPreview.scrollHeight - markdownPreview.clientHeight)
    }

    markdownPreview.addEventListener("scroll", handleMarkdownScroll)
    wordPreview.addEventListener("scroll", handleWordScroll)

    return () => {
      markdownPreview.removeEventListener("scroll", handleMarkdownScroll)
      wordPreview.removeEventListener("scroll", handleWordScroll)
    }
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setMarkdownContent(content)
      }
      reader.readAsText(file)
    }
  }

  const handlePaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownContent(e.target.value)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const downloadAsWord = () => {
    // Create a blob with HTML content that Word can open
    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:w="urn:schemas-microsoft-com:office:word" 
            xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <title>Exported Document</title>
          <style>
            h1 { font-size: 24pt; font-weight: bold; }
            h2 { font-size: 18pt; font-weight: bold; }
            h3 { font-size: 14pt; font-weight: bold; }
            p { font-size: 12pt; }
            ul, ol { margin-left: 20px; }
            strong { font-weight: bold; }
            em { font-style: italic; }
          </style>
        </head>
        <body>
          ${wordPreviewRef.current?.innerHTML || ""}
        </body>
      </html>
    `

    const blob = new Blob([htmlContent], { type: "application/msword" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "document.doc"
    link.click()
  }

  const copyWordContent = () => {
    if (!wordPreviewRef.current) return

    // Create a temporary element with the content
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = wordPreviewRef.current.innerHTML

    // Apply styles to make it rich text
    tempDiv.style.position = "fixed"
    tempDiv.style.left = "-99999px"
    tempDiv.setAttribute("contenteditable", "true")
    document.body.appendChild(tempDiv)

    // Select the content
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(tempDiv)
    selection?.removeAllRanges()
    selection?.addRange(range)

    // Execute copy command with rich text format
    document.execCommand("copy")

    // Clean up
    document.body.removeChild(tempDiv)
    selection?.removeAllRanges()

    alert("Content copied to clipboard in rich text format!")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Markdown to Word Converter</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side - Markdown input and preview */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Markdown</h2>

          <Tabs defaultValue="paste" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="paste">Paste Markdown</TabsTrigger>
              <TabsTrigger value="upload">Upload File</TabsTrigger>
            </TabsList>
            <TabsContent value="paste" className="space-y-4">
              <Textarea
                placeholder="Paste your markdown content here..."
                className="min-h-[300px]"
                value={markdownContent}
                onChange={handlePaste}
              />
            </TabsContent>
            <TabsContent value="upload" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div
                    className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={triggerFileInput}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".md, .markdown, .txt"
                      onChange={handleFileUpload}
                    />
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">Supports .md, .markdown, .txt</p>
                    <Button variant="outline" className="mt-4" onClick={triggerFileInput}>
                      <Upload className="mr-2 h-4 w-4" /> Select File
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div ref={markdownPreviewRef} className="border rounded-lg p-4 bg-[#0d1117] text-white h-[500px] overflow-auto dark">
            <h3 className="text-lg font-medium mb-2 text-white">Markdown Preview</h3>
            <Separator className="mb-4 bg-gray-700" />
            <div className="prose prose-sm md:prose-base lg:prose max-w-none dark:prose-invert 
                 prose-headings:text-white prose-headings:font-semibold
                 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg 
                 prose-a:no-underline
                 prose-blockquote:border-l-4 prose-blockquote:pl-4
                 prose-ol:list-decimal prose-ul:list-disc">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                  code({node, inline, className, children, ...props}) {
                    return (
                      <code
                        className={`${inline ? 'bg-[#161b22] text-[#c9d1d9] px-1 py-0.5 rounded text-sm' : ''}`}
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  },
                  pre({node, children, ...props}) {
                    return (
                      <pre
                        className="bg-[#161b22] p-4 rounded-md overflow-auto border border-[#30363d]"
                        {...props}
                      >
                        {children}
                      </pre>
                    )
                  }
                }}
              >
                {markdownContent || "Preview will appear here..."}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Right side - Word preview */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Word Document</h2>

          <div className="flex justify-end space-x-2 mb-2">
            <Button variant="outline" size="sm" onClick={copyWordContent}>
              <Copy className="mr-2 h-4 w-4" /> Copy as Rich Text
            </Button>
            <Button size="sm" onClick={downloadAsWord}>
              <Download className="mr-2 h-4 w-4" /> Download as Word
            </Button>
          </div>

          <div ref={wordPreviewRef} className="border rounded-lg p-4 bg-white h-[500px] shadow-sm overflow-auto">
            <div className="word-preview prose prose-sm md:prose-base lg:prose max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-blue-600 prose-strong:font-bold prose-em:italic prose-ul:list-disc prose-ol:list-decimal">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
              >
                {markdownContent || "Preview will appear here..."}
              </ReactMarkdown>
            </div>
          </div>

          <div className="text-sm text-muted-foreground mt-2">
            <p>
              Note: The Word document preview simulates how content will appear in Microsoft Word. Some advanced
              formatting may vary in the actual Word document.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

