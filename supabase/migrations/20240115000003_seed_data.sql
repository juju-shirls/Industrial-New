-- Insert default categories for payment industry
INSERT INTO categories (name, slug, description, sort_order, enabled) VALUES
    ('支付终端', 'payment-terminal', '包含 POS、SoftPOS、智能终端、支付硬件、安全芯片、NFC、生物识别等', 1, true),
    ('支付网关', 'payment-gateway', '包含在线支付、收单、PSP、结账、路由、风控、支付编排等', 2, true),
    ('支付 SaaS / ISV', 'payment-saas-isv', '包含商户服务、订阅支付、账单管理、SaaS 收单、ISV 分润、垂直行业解决方案等', 3, true),
    ('支付 AI 科技', 'payment-ai-tech', '包含 AI 风控、智能客服、交易反欺诈、智能支付、Tokenization 等', 4, true),
    ('Crypto / 稳定币', 'crypto-stablecoin', '包含 Crypto、Stablecoin、区块链支付、数字货币等', 5, true),
    ('支付监管与合规', 'payment-regulation-compliance', '包含牌照、AML、KYC、数据合规、PCI DSS、监管政策、反洗钱等', 6, true),
    ('跨境支付', 'cross-border-payment', '包含国际汇款、外汇、跨境电商支付、全球支付网络等', 7, true),
    ('公司动态', 'company-news', '包含支付公司的业务发展、战略调整、管理变更等新闻', 8, true),
    ('投融资 / 并购', 'investment-ma', '包含支付行业的投资、融资、并购、IPO 等资本市场动态', 9, true),
    ('其他', 'others', '其他支付相关新闻和资讯', 10, true);

-- Insert default tags for payment industry
INSERT INTO tags (name, slug, description) VALUES
    -- Payment Terminal Tags
    ('POS', 'pos', 'Point of Sale 销售点终端'),
    ('SoftPOS', 'softpos', '软件 POS 解决方案'),
    ('NFC', 'nfc', '近场通信技术'),
    ('生物识别', 'biometric', '指纹、人脸、虹膜等生物识别技术'),
    ('安全芯片', 'security-chip', '支付安全芯片和加密技术'),
    
    -- Payment Gateway Tags
    ('PSP', 'psp', 'Payment Service Provider 支付服务提供商'),
    ('Acquiring', 'acquiring', '收单业务'),
    ('Checkout', 'checkout', '结账和支付体验'),
    ('Routing', 'routing', '支付路由和优化'),
    ('Fraud', 'fraud', '欺诈检测和风控'),
    ('Orchestration', 'orchestration', '支付编排'),
    
    -- SaaS/ISV Tags
    ('订阅支付', 'subscription', '订阅制支付模式'),
    ('账单管理', 'billing', '账单和发票管理'),
    ('ISV', 'isv', 'Independent Software Vendor 独立软件供应商'),
    ('分润', 'revenue-sharing', '收入分成和分润'),
    ('垂直行业', 'vertical-industry', '特定行业解决方案'),
    
    -- AI/Tech Tags
    ('AI', 'ai', '人工智能技术'),
    ('机器学习', 'machine-learning', '机器学习算法'),
    ('风控', 'risk-management', '风险控制和管理'),
    ('反欺诈', 'anti-fraud', '反欺诈技术'),
    ('Tokenization', 'tokenization', '令牌化技术'),
    
    -- Crypto Tags
    ('Bitcoin', 'bitcoin', '比特币'),
    ('Ethereum', 'ethereum', '以太坊'),
    ('USDC', 'usdc', 'USD Coin 稳定币'),
    ('USDT', 'usdt', 'Tether 稳定币'),
    ('Stablecoin', 'stablecoin', '稳定币'),
    ('DeFi', 'defi', '去中心化金融'),
    ('Web3', 'web3', 'Web3 和区块链'),
    
    -- Compliance Tags
    ('AML', 'aml', 'Anti-Money Laundering 反洗钱'),
    ('KYC', 'kyc', 'Know Your Customer 了解你的客户'),
    ('PCI DSS', 'pci-dss', 'Payment Card Industry Data Security Standard'),
    ('GDPR', 'gdpr', 'General Data Protection Regulation'),
    ('监管', 'regulation', '监管政策和法规'),
    ('合规', 'compliance', '合规要求和标准'),
    
    -- Company Tags
    ('Visa', 'visa', 'Visa 公司'),
    ('Mastercard', 'mastercard', 'Mastercard 公司'),
    ('PayPal', 'paypal', 'PayPal 公司'),
    ('Stripe', 'stripe', 'Stripe 公司'),
    ('Square', 'square', 'Square 公司'),
    ('Adyen', 'adyen', 'Adyen 公司'),
    ('Ant Group', 'ant-group', '蚂蚁集团'),
    ('Tencent', 'tencent', '腾讯公司'),
    ('UnionPay', 'unionpay', '中国银联'),
    
    -- Regional Tags
    ('北美', 'north-america', '北美地区市场'),
    ('欧洲', 'europe', '欧洲地区市场'),
    ('亚太', 'asia-pacific', '亚太地区市场'),
    ('中国', 'china', '中国市场'),
    ('美国', 'usa', '美国市场'),
    ('新兴市场', 'emerging-markets', '新兴市场'),
    
    -- Business Model Tags
    ('B2B', 'b2b', 'Business to Business'),
    ('B2C', 'b2c', 'Business to Consumer'),
    ('C2C', 'c2c', 'Consumer to Consumer'),
    ('电商', 'ecommerce', '电子商务'),
    ('移动支付', 'mobile-payment', '移动支付'),
    ('嵌入式支付', 'embedded-payment', '嵌入式支付'),
    
    -- Financial Tags
    ('融资', 'funding', '公司融资'),
    ('IPO', 'ipo', '首次公开募股'),
    ('并购', 'merger-acquisition', '合并收购'),
    ('估值', 'valuation', '公司估值'),
    ('投资', 'investment', '投资活动');

-- Insert sample news sources
INSERT INTO news_sources (name, type, url, enabled, crawl_interval_minutes) VALUES
    ('Finextra', 'rss', 'https://www.finextra.com/rss/news.aspx', true, 60),
    ('PaymentsSource', 'rss', 'https://www.paymentssource.com/feed', true, 90),
    ('TechCrunch Fintech', 'rss', 'https://techcrunch.com/category/fintech/feed/', true, 120),
    ('Reuters Business', 'rss', 'https://feeds.reuters.com/reuters/businessNews', true, 180),
    ('移动支付网', 'website', 'https://www.mpaypass.com.cn', true, 240),
    ('财经网支付频道', 'website', 'http://www.caijing.com.cn/finance/', true, 360);

-- Create default admin user (password should be changed immediately)
INSERT INTO users (name, email, role) VALUES
    ('系统管理员', 'admin@wisevision.com', 'admin'),
    ('编辑员', 'editor@wisevision.com', 'editor');

-- Insert sample daily digest
INSERT INTO daily_digests (digest_date, title, content, status) VALUES
    (CURRENT_DATE, '今日支付行业资讯摘要', '今日支付行业重要资讯汇总，包含最新的技术发展、监管动态和市场趋势。', 'draft');