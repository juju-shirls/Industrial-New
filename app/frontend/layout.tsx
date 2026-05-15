import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PaymentNews - 支付行业资讯聚合平台',
  description: '专业的支付行业资讯聚合平台，为金融科技从业者提供最新、最全面的行业动态、政策法规、产品发布和市场分析。',
  keywords: ['支付', '金融科技', 'PayTech', 'CBDC', '数字货币', '跨境支付', 'AI支付', 'Web3'],
  openGraph: {
    title: 'PaymentNews - 支付行业资讯聚合平台',
    description: '专业的支付行业资讯聚合平台，为金融科技从业者提供最新、最全面的行业动态。',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PaymentNews - 支付行业资讯聚合平台',
    description: '专业的支付行业资讯聚合平台，为金融科技从业者提供最新、最全面的行业动态。',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dark">
      {children}
    </div>
  )
}