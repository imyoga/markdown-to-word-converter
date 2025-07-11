"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Upload, Copy, FileText, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

export default function MarkdownToWordConverter() {
  const [markdownContent, setMarkdownContent] =
    useState<string>(`# Welcome to Markdown to Word Converter!

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

Enjoy using the converter!`);
  const [activeTab, setActiveTab] = useState<string>("paste");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const markdownPreviewRef = useRef<HTMLDivElement>(null);
  const wordPreviewRef = useRef<HTMLDivElement>(null);

  // Synchronize scrolling between the two preview panes
  useEffect(() => {
    // Removed scroll synchronization since containers now expand with content
    return () => {};
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setMarkdownContent(content);
      };
      reader.readAsText(file);
    }
  };

  const handlePaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownContent(e.target.value);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const copyWordContent = () => {
    const wordPreviewContent =
      wordPreviewRef.current?.querySelector(".word-preview");
    if (!wordPreviewContent) return;

    // Create a temporary element with the content
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = wordPreviewContent.innerHTML;

    // Apply word preview styles to ensure all formatting is preserved
    tempDiv.className = "word-preview";
    tempDiv.style.position = "fixed";
    tempDiv.style.left = "-99999px";
    tempDiv.style.backgroundColor = "white";
    tempDiv.style.color = "#333";
    
    // Ensure bold and italic styles are explicitly set
    const boldElements = tempDiv.querySelectorAll('strong');
    boldElements.forEach(el => {
      el.style.fontWeight = 'bold';
    });
    
    const italicElements = tempDiv.querySelectorAll('em');
    italicElements.forEach(el => {
      el.style.fontStyle = 'italic';
    });
    
    tempDiv.setAttribute("contenteditable", "true");
    document.body.appendChild(tempDiv);

    // Select the content
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(tempDiv);
    selection?.removeAllRanges();
    selection?.addRange(range);

    // Execute copy command with rich text format
    document.execCommand("copy");

    // Clean up
    document.body.removeChild(tempDiv);
    selection?.removeAllRanges();

    alert("Content copied to clipboard in rich text format!");
  };

  const copyMarkdownContent = () => {
    // Copy the raw markdown content to clipboard
    navigator.clipboard.writeText(markdownContent)
      .then(() => {
        alert("Markdown content copied to clipboard!");
      })
      .catch(err => {
        console.error('Failed to copy markdown: ', err);
        alert("Failed to copy markdown content.");
      });
  };

  const convertToWhatsAppFormat = (markdown: string): string => {
    let whatsappText = markdown;
    
    // Handle code blocks first (with language specifiers) - remove language and keep content
    whatsappText = whatsappText.replace(/```\w*\n?([\s\S]*?)```/g, '```$1```');
    
    // Convert inline code (`code`) to WhatsApp monospace (```code```)
    whatsappText = whatsappText.replace(/`([^`]+?)`/g, '```$1```');
    
    // Convert headers to bold and italic - use placeholders to protect them
    whatsappText = whatsappText.replace(/^###### (.+)$/gm, '<<HEADER>>$1<<HEADER>>');
    whatsappText = whatsappText.replace(/^##### (.+)$/gm, '<<HEADER>>$1<<HEADER>>');
    whatsappText = whatsappText.replace(/^#### (.+)$/gm, '<<HEADER>>$1<<HEADER>>');
    whatsappText = whatsappText.replace(/^### (.+)$/gm, '<<HEADER>>$1<<HEADER>>');
    whatsappText = whatsappText.replace(/^## (.+)$/gm, '<<HEADER>>$1<<HEADER>>');
    whatsappText = whatsappText.replace(/^# (.+)$/gm, '<<HEADER>>$1<<HEADER>>');
    
    // Convert bold markdown (**text** or __text__) to WhatsApp bold (*text*)
    whatsappText = whatsappText.replace(/\*\*([^\*]+?)\*\*/g, '<<BOLD>>$1<<BOLD>>');
    whatsappText = whatsappText.replace(/__([^_]+?)__/g, '<<BOLD>>$1<<BOLD>>');
    
    // Convert strikethrough (~~text~~) to WhatsApp strikethrough (~text~)
    whatsappText = whatsappText.replace(/~~([^~]+?)~~/g, '~$1~');
    
    // Convert italic markdown (*text* or _text_) to WhatsApp italic (_text_)
    // Use placeholders to avoid conflicts
    whatsappText = whatsappText.replace(/\*([^\*]+?)\*/g, '<<ITALIC>>$1<<ITALIC>>');
    whatsappText = whatsappText.replace(/_([^_]+?)_/g, '<<ITALIC>>$1<<ITALIC>>');
    
    // Replace placeholders with WhatsApp formatting
    whatsappText = whatsappText.replace(/<<HEADER>>(.+?)<<HEADER>>/g, '*_$1_*');
    whatsappText = whatsappText.replace(/<<BOLD>>/g, '*');
    whatsappText = whatsappText.replace(/<<ITALIC>>/g, '_');
    
    // Convert blockquotes (> text) - WhatsApp doesn't have native blockquotes, 
    // but we can use the > symbol which WhatsApp recognizes
    whatsappText = whatsappText.replace(/^>\s+(.+)$/gm, '> _$1_');
    
    // Convert links [text](url) to "text (url)"
    whatsappText = whatsappText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');
    
    // Clean up horizontal rules
    whatsappText = whatsappText.replace(/^[-*_]{3,}$/gm, '────────────');
    
    // Convert unordered lists (- or *) to bullet points
    whatsappText = whatsappText.replace(/^[-*]\s+(.+)$/gm, '• $1');
    
    // Convert ordered lists (1. 2. etc.) to numbered format
    whatsappText = whatsappText.replace(/^\d+\.\s+(.+)$/gm, (match, content, offset, string) => {
      const lines = string.substring(0, offset).split('\n');
      const currentListItems = lines.filter((line: string) => /^\d+\.\s+/.test(line)).length;
      return `${currentListItems + 1}. ${content}`;
    });
    
    // Clean up extra whitespace but preserve intentional line breaks
    whatsappText = whatsappText.replace(/\n{3,}/g, '\n\n');
    
    return whatsappText.trim();
  };

  const copyWhatsAppContent = () => {
    const whatsappFormatted = convertToWhatsAppFormat(markdownContent);
    navigator.clipboard.writeText(whatsappFormatted)
      .then(() => {
        alert("Content copied in WhatsApp format!");
      })
      .catch(err => {
        console.error('Failed to copy WhatsApp format: ', err);
        alert("Failed to copy WhatsApp formatted content.");
      });
  };

  const downloadWordDocument = () => {
    const wordPreviewContent = wordPreviewRef.current?.querySelector(".word-preview");
    if (!wordPreviewContent) return;

    // Get the HTML content
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head>
        <meta charset="utf-8">
        <title>Markdown to Word Document</title>
        <style>
          body { font-family: 'Calibri', sans-serif; }
          pre { background-color: #f6f8fa; padding: 10px; border: 1px solid #ddd; white-space: pre-wrap; }
          code { background-color: #f6f8fa; color: #333; padding: 2px 4px; border: 1px solid #e1e4e8; border-radius: 3px; }
          blockquote { border-left: 4px solid #ddd; background-color: #f9f9f9; padding-left: 10px; font-style: italic; }
          strong { font-weight: bold; }
          em { font-style: italic; }
          ul { list-style-type: disc; padding-left: 20px; }
          ol { list-style-type: decimal; padding-left: 20px; }
        </style>
      </head>
      <body>
        ${wordPreviewContent.innerHTML}
      </body>
      </html>
    `;

    // Create a Blob with the HTML content
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    
    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'document.doc';
    
    // Append the link to the body
    document.body.appendChild(link);
    
    // Click the link to trigger the download
    link.click();
    
    // Remove the link
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Markdown to Word Converter
      </h1>

      {/* Row 1: Input Section (Centered) */}
      <div className="mb-8 max-w-3xl mx-auto">
        <Tabs
          defaultValue="paste"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
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
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports .md, .markdown, .txt
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={triggerFileInput}
                  >
                    <Upload className="mr-2 h-4 w-4" /> Select File
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Row 2: Preview Sections (Side by Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side - Markdown preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Markdown Preview</h3>
            <Button variant="outline" size="sm" onClick={copyMarkdownContent}>
              <Copy className="mr-2 h-4 w-4" /> Copy Markdown
            </Button>
          </div>
          <div
            ref={markdownPreviewRef}
            className="border rounded-lg p-4 bg-[#0d1117] text-white dark"
          >
            <div
              className="prose prose-sm md:prose-base lg:prose max-w-none dark:prose-invert 
                 prose-headings:text-white prose-headings:font-semibold
                 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg 
                 prose-a:no-underline
                 prose-blockquote:border-l-4 prose-blockquote:pl-4
                 prose-ol:list-decimal prose-ul:list-disc"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    return (
                      <code
                        className={`${
                          inline
                            ? "bg-[#161b22] text-[#c9d1d9] px-1 py-0.5 rounded text-sm"
                            : ""
                        }`}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  pre({ node, children, ...props }) {
                    return (
                      <pre
                        className="bg-[#161b22] p-4 rounded-md overflow-auto border border-[#30363d]"
                        {...props}
                      >
                        {children}
                      </pre>
                    );
                  },
                }}
              >
                {markdownContent || "Preview will appear here..."}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Right side - Word preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Word Preview</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={copyWordContent}>
                <Copy className="mr-2 h-4 w-4" /> Copy as Rich Text
              </Button>
              <Button variant="outline" size="sm" onClick={copyWhatsAppContent}>
                <Copy className="mr-2 h-4 w-4" /> Copy for WhatsApp
              </Button>
              <Button variant="outline" size="sm" onClick={downloadWordDocument}>
                <Download className="mr-2 h-4 w-4" /> Download as .doc
              </Button>
            </div>
          </div>

          <div
            ref={wordPreviewRef}
            className="border rounded-lg shadow-md bg-[#f0f0f0]"
          >
            {/* Word-like document area with page styling */}
            <div className="word-preview bg-white rounded shadow-sm max-w-[8.5in] mx-auto my-6 py-8 px-8">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    return (
                      <code
                        className={`${
                          inline
                            ? "bg-[#f6f8fa] text-[#333] px-1 py-0.5 rounded text-sm border border-[#e1e4e8]"
                            : ""
                        }`}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  pre({ node, children, ...props }) {
                    return (
                      <pre
                        className="bg-[#f6f8fa] p-3 rounded-md overflow-auto border border-[#ddd] text-sm whitespace-pre-wrap"
                        {...props}
                      >
                        {children}
                      </pre>
                    );
                  },
                  ul({ node, ...props }) {
                    return <ul className="list-disc pl-6 mb-3" {...props} />;
                  },
                  ol({ node, ...props }) {
                    return <ol className="list-decimal pl-6 mb-3" {...props} />;
                  },
                  li({ node, ...props }) {
                    return <li className="mb-1 text-base" {...props} />;
                  },
                  blockquote({ node, ...props }) {
                    return (
                      <blockquote
                        className="border-l-4 border-[#ddd] bg-[#f9f9f9] pl-3 py-1 italic"
                        {...props}
                      />
                    );
                  },
                  strong({ node, ...props }) {
                    return <strong style={{ fontWeight: "bold" }} {...props} />;
                  },
                  em({ node, ...props }) {
                    return <em style={{ fontStyle: "italic" }} {...props} />;
                  },
                }}
              >
                {markdownContent || "Preview will appear here..."}
              </ReactMarkdown>
            </div>
          </div>

          <div className="text-sm text-muted-foreground mt-2">
            <p>
              Note: The Word document preview simulates how content will appear
              in Microsoft Word. Some advanced formatting may vary in the actual
              Word document.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
