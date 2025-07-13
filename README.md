# Base64 Util 🔄

A modern, fast, and secure utility for converting files to base64 encoding and decoding base64 strings back to files. Built with Next.js and Tailwind CSS, optimized for Cloudflare Pages deployment.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Deployed on Cloudflare Pages](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-orange.svg)](https://base64-util.pages.dev)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black.svg)](https://nextjs.org)
[![Styled with Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38bdf8.svg)](https://tailwindcss.com)

## 📌 Overview

Base64 Util provides a clean, browser-based interface for encoding files to base64 strings and decoding base64 strings back to files. All processing happens locally in your browser, ensuring your data never leaves your device.

**[Try the Live Demo](https://base64-util.pages.dev)**

## ✨ Features

- **🔄 Bidirectional Conversion**: Convert files to base64 and decode base64 strings back to downloadable files
- **🧠 Smart File Type Detection**: Automatically detects file types from base64 data using signature analysis
- **🖱️ Drag & Drop Interface**: Easy file upload with drag and drop support
- **📋 Clipboard Integration**: One-click copy of encoded data and paste functionality for decoding
- **🖼️ File Preview**: Preview supported file types directly in the browser
- **📜 Conversion History**: Track your recent conversions with metadata
- **🔒 Privacy First**: All processing happens locally in your browser - no server uploads
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🌙 Dark Mode Support**: Automatic dark/light mode based on system preferences
- **⚡ Fast Performance**: Optimized for speed and efficiency
- **☁️ Edge Deployment**: Deployed on Cloudflare's global edge network

## 🚀 Supported File Types

Base64 Util can handle any file type for encoding, and features intelligent file type detection for decoding:

- **Images**: JPEG, PNG, GIF, WebP, SVG, BMP, ICO
- **Documents**: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
- **Text Files**: TXT, HTML, CSS, JS, JSON, XML, CSV
- **Archives**: ZIP, RAR, 7Z, TAR, GZ
- **Media**: MP3, WAV, OGG, MP4, AVI, MOV, WebM
- **And More**: Support for any file format with manual type selection

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5.8](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **Build Optimization**: Static export optimized for Edge Runtime

## 🏃‍♂️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20.0.0 or higher
- npm or yarn package manager

### Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/whatley95/base64-util.git
   cd base64-util
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Build for Cloudflare Pages**
   ```bash
   npm run pages:build
   ```

### Deployment to Cloudflare Pages

1. **Using Wrangler CLI**
   ```bash
   npm run pages:deploy
   ```

2. **Using Git Integration**
   - Connect your repository to Cloudflare Pages
   - Set build command: `npm run build && npm run pages:build`
   - Set build output directory: `out`
   - Add environment variable: `NODE_VERSION: 20`

## 📖 Usage

### File to Base64

1. **Upload Method**: Click the upload area or drag and drop a file
2. **Processing**: File is automatically converted to base64
3. **Results**: View file information, preview (for images), and copy base64 string

### Base64 to File

1. **Input Method**: Paste base64 string (with or without data URL prefix)
2. **Decode**: Click "Decode to File" button
3. **Download**: Download the decoded file to your device

### Features

- **Copy Base64**: Copy the full data URL or raw base64 string
- **Download Files**: Download decoded files directly
- **Conversion History**: View your last 10 conversions
- **File Preview**: Preview images before download

## 🔒 Privacy & Security

- **Client-Side Processing**: All conversions happen in your browser
- **No Data Upload**: Files never leave your device
- **No Server Storage**: Nothing is stored on any server
- **Secure Headers**: Security headers implemented for protection

## 🌐 Browser Support

- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support
- **Edge**: ✅ Full support
- **Mobile Browsers**: ✅ Responsive support

## 📝 API Reference

### File Data Interface

```typescript
interface FileData {
  name: string        // Original filename
  type: string        // MIME type
  size: number        // File size in bytes
  base64: string      // Base64 data URL
  lastModified: number // Last modified timestamp
}
```

### Supported Input Formats

- **Files**: Any file type via drag & drop or file picker
- **Base64**: Raw base64 strings or data URLs
- **Data URLs**: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 whatley95

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Deployed on [Cloudflare Pages](https://pages.cloudflare.com/)
- File type detection uses signature analysis (magic bytes)

---

**Made with ❤️ for the developer community**
