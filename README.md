# Base64 Util 🔄

A modern, fast, and secure utility for converting files to base64 and decoding base64 back to files. Built with Next.js and optimized for Cloudflare Pages.

## ✨ Features

- **🔄 Bidirectional Conversion**: Convert files to base64 and decode base64 to files
- **🖱️ Drag & Drop Interface**: Easy file upload with drag and drop support
- **📋 Clipboard Integration**: Copy base64 strings and paste them for decoding
- **🖼️ Image Preview**: Preview images directly in the browser
- **📜 Conversion History**: Track your recent conversions
- **🔒 Privacy First**: All processing happens locally in your browser
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🌙 Dark Mode**: Automatic dark/light mode support
- **⚡ Fast Performance**: Optimized for speed and efficiency
- **☁️ Cloudflare Pages**: Deployed on Cloudflare's global network

## 🚀 Supported File Types

- **Images**: JPEG, PNG, GIF, WebP, SVG, BMP
- **Documents**: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
- **Text Files**: TXT, HTML, CSS, JS, JSON, XML, CSV
- **Archives**: ZIP, RAR, 7Z, TAR, GZ
- **Media**: MP3, MP4, AVI, MOV, WAV, and more
- **Any File Type**: Universal support for all file formats

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Cloudflare Pages
- **Performance**: Edge Runtime optimization

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 20.0.0 or higher
- npm or yarn

### Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
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

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Deployed on [Cloudflare Pages](https://pages.cloudflare.com/)
- Icons from Unicode Emoji

---

**Made with ❤️ for the developer community**
"# base64-util" 
