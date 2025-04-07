# Markdown to Word Converter

A modern web application that allows users to convert Markdown content to Word document format while preserving formatting. This tool provides a real-time preview of both the Markdown and the corresponding Word document appearance.

![Markdown to Word Converter Screenshot](/placeholder.svg?height=400&width=800)

## Features

- **Dual Preview Interface**: Side-by-side comparison of Markdown and Word output
- **Multiple Input Methods**: Paste Markdown text or upload Markdown files
- **Synchronized Scrolling**: Both preview panes scroll together for easy comparison
- **Rich Text Export**: Download as Word document or copy rich text to clipboard
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- **Next.js**: React framework for the application
- **React**: Frontend library for building the user interface
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling
- **shadcn/ui**: Component library based on Radix UI
- **ReactMarkdown**: For rendering Markdown content

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/markdown-to-word-converter.git
   cd markdown-to-word-converter
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Enter or paste Markdown text into the editor, or use the upload button to load a Markdown file
2. The left panel displays your Markdown content with syntax highlighting
3. The right panel shows a real-time preview of how the content will appear in Word
4. Use the export options to:
   - Download as a Word document (.docx)
   - Copy as rich text to paste into Word or other applications
   - Save as HTML

## Project Structure

```
markdown-to-word-converter/
├── app/                  # Next.js app directory
│   ├── components/       # React components
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── lib/                  # Utility functions
│   └── markdown-to-word/ # Conversion logic
├── public/               # Static assets
└── styles/               # CSS styles
```

## Key Components

- **MarkdownEditor**: Text area with syntax highlighting for editing Markdown
- **WordPreview**: Real-time preview of the Word document output
- **ToolBar**: Contains export options and formatting controls
- **FileUploader**: Handles Markdown file uploads

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React Markdown](https://github.com/remarkjs/react-markdown) for Markdown parsing
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Next.js](https://nextjs.org/) for the React framework
