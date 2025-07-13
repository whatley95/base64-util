import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Base64 Util - File to Base64 Converter',
  description: 'Convert files to base64 and base64 back to files with this easy-to-use utility.',
  keywords: ['base64', 'file converter', 'utility', 'encode', 'decode'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
