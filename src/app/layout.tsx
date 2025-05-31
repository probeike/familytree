import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Layout from '@/components/Layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Family Tree | Genealogy & History',
  description: 'Interactive family tree and genealogy website preserving our family history across generations',
  keywords: 'family tree, genealogy, family history, Goitein, Rosner, Botha, Gouws',
  authors: [{ name: 'Family Tree Project' }],
  openGraph: {
    title: 'Family Tree | Genealogy & History',
    description: 'Interactive family tree and genealogy website preserving our family history across generations',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}