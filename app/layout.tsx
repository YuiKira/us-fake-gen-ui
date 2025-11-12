import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'US Address Generator - 美国地址生成器',
  description: '生成真实可靠的美国地址和个人信息数据，用于测试、开发等合法用途',
  keywords: '美国地址生成器,美国个人信息,虚假数据生成,测试数据',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
