import type { CrawlerConfig } from './types'

// Default crawler configuration
export const DEFAULT_CRAWLER_CONFIG: CrawlerConfig = {
  userAgent: 'WiseVision-Crawler/1.0 (Payment Industry News Aggregator; +https://wisevision.com/bot)',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 2000, // 2 seconds
  maxConcurrency: 5,
  respectRobotsTxt: true,
  delayBetweenRequests: 1000, // 1 second
  maxContentLength: 5 * 1024 * 1024, // 5MB
  enableJavaScript: false, // Start with static content only
}

// Payment industry keywords for content filtering
export const PAYMENT_KEYWORDS = [
  // English keywords
  'payment', 'payments', 'fintech', 'financial technology', 'pos', 'point of sale',
  'payment processor', 'payment gateway', 'payment service provider', 'psp',
  'acquiring', 'merchant services', 'card processing', 'digital payments',
  'mobile payments', 'contactless', 'nfc', 'emv', 'chip card', 'tokenization',
  'payment security', 'pci dss', 'fraud detection', 'risk management',
  'cryptocurrency', 'crypto', 'bitcoin', 'blockchain', 'stablecoin', 'cbdc',
  'defi', 'web3', 'digital wallet', 'e-wallet', 'mobile wallet',
  'cross-border payments', 'remittance', 'foreign exchange', 'fx',
  'kyc', 'aml', 'anti-money laundering', 'compliance', 'regulatory',
  'visa', 'mastercard', 'amex', 'discover', 'unionpay', 'jcb',
  'stripe', 'square', 'paypal', 'adyen', 'worldpay', 'fiserv',
  'subscription billing', 'recurring payments', 'saas payments',
  'embedded payments', 'payment orchestration', 'payment routing',
  
  // Chinese keywords
  '支付', '移动支付', '第三方支付', '支付宝', '微信支付', '银联', '数字人民币',
  '金融科技', 'fintech', '支付牌照', '收单', '聚合支付', '刷脸支付',
  'pos机', '扫码支付', '无感支付', '生物支付', '支付安全', '风控',
  '反洗钱', '合规', '央行', '监管', '跨境支付', '外汇', '汇率',
  '区块链', '数字货币', '加密货币', '比特币', '以太坊', '稳定币',
  '去中心化金融', 'defi', '智能合约', 'nft', 'web3',
  '银行卡', '信用卡', '借记卡', '预付卡', '虚拟卡',
  '电子钱包', '数字钱包', '手机钱包', 'app支付', 'h5支付',
  '商户服务', '收银系统', '支付终端', '支付网关', '支付接口',
  'saas支付', '订阅支付', '分期付款', '消费金融', '供应链金融'
]

// Common payment-related domains for allow-list
export const PAYMENT_DOMAINS = [
  // English domains
  'finextra.com', 'paymentssource.com', 'paymentsjournal.com', 'thepaypers.com',
  'pymnts.com', 'cardsandpayments.com', 'mobilepaymentstechnology.com',
  'paymentssecurityreport.com', 'paymentscardsandmobile.com',
  'retailpaymentsinternational.com', 'atmmarketplace.com',
  'techcrunch.com/category/fintech', 'venturebeat.com/fintech',
  'bloomberg.com', 'reuters.com/technology/fintech', 'coindesk.com',
  'cointelegraph.com', 'decrypt.co', 'theblock.co', 'fintechnews.com',
  
  // Chinese domains
  'mpaypass.com.cn', 'xinhuanet.com', 'people.com.cn', 'caijing.com.cn',
  'yicai.com', 'jiemian.com', 'wallstreetcn.com', 'cls.cn',
  'tmtpost.com', '36kr.com', 'iyiou.com', 'chuhaipost.com',
  'mobilepay.org.cn', 'chinabank.com.cn', 'pbc.gov.cn',
  '8btc.com', 'chaindd.com', 'odaily.news', 'forkast.news'
]

// Content parsing rules
export const CONTENT_PARSING_RULES = {
  // Selectors to try for article content (in order of preference)
  contentSelectors: [
    'article',
    '[role="main"] .content',
    '.post-content',
    '.article-content',
    '.entry-content',
    '.news-content',
    '.story-body',
    '.article-body',
    '.content-body',
    '[itemprop="articleBody"]',
    '.main-content',
    '#content',
    '.content'
  ],
  
  // Selectors to remove from content
  removeSelectors: [
    'script', 'style', 'nav', 'header', 'footer', 'aside',
    '.advertisement', '.ads', '.ad', '.sidebar', '.menu',
    '.social-share', '.comments', '.related-posts', '.popup',
    '[role="banner"]', '[role="navigation"]', '[role="complementary"]'
  ],
  
  // Title selectors
  titleSelectors: [
    'h1', 'title', '[itemprop="headline"]', '.article-title', 
    '.post-title', '.news-title', '.entry-title', 'h1.title'
  ],
  
  // Author selectors
  authorSelectors: [
    '[itemprop="author"]', '[rel="author"]', '.author', '.by-author',
    '.article-author', '.post-author', '.byline', '.writer'
  ],
  
  // Date selectors
  dateSelectors: [
    '[itemprop="datePublished"]', '[itemprop="dateCreated"]', 
    'time', '.publish-date', '.article-date', '.post-date',
    '.date', '.timestamp', '.published'
  ]
}

// Rate limiting configuration per domain
export const RATE_LIMITS: Record<string, { requestsPerMinute: number; delayMs: number }> = {
  // Conservative defaults for unknown domains
  default: { requestsPerMinute: 30, delayMs: 2000 },
  
  // Known friendly sites
  'finextra.com': { requestsPerMinute: 60, delayMs: 1000 },
  'paymentssource.com': { requestsPerMinute: 45, delayMs: 1500 },
  'mpaypass.com.cn': { requestsPerMinute: 30, delayMs: 2000 },
  
  // More conservative for news sites
  'reuters.com': { requestsPerMinute: 20, delayMs: 3000 },
  'bloomberg.com': { requestsPerMinute: 20, delayMs: 3000 },
  'techcrunch.com': { requestsPerMinute: 30, delayMs: 2000 }
}

// Language detection patterns
export const LANGUAGE_PATTERNS = {
  'zh-CN': /[\u4e00-\u9fff]/g, // Chinese characters
  'en': /^[a-zA-Z\s.,!?;:'"()-]+$/g,
  'ja': /[\u3040-\u309f\u30a0-\u30ff]/g, // Japanese hiragana/katakana
  'ko': /[\uac00-\ud7af]/g // Korean
}

// Content quality thresholds
export const QUALITY_THRESHOLDS = {
  minContentLength: 200, // Minimum characters for valid content
  maxContentLength: 50000, // Maximum characters to process
  minTitleLength: 10,
  maxTitleLength: 200,
  minWordCount: 50,
  maxDuplicatePercentage: 0.8 // 80% similarity threshold
}