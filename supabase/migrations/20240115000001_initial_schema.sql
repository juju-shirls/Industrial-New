-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Create custom types
CREATE TYPE source_type AS ENUM ('rss', 'website', 'api', 'search');
CREATE TYPE article_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE importance_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE job_status AS ENUM ('pending', 'running', 'success', 'failed');
CREATE TYPE ai_job_type AS ENUM ('summarize', 'classify', 'tag');
CREATE TYPE push_type AS ENUM ('daily_digest', 'breaking_news', 'manual');
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');
CREATE TYPE digest_status AS ENUM ('draft', 'sent');

-- News Sources Table
CREATE TABLE news_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type source_type NOT NULL DEFAULT 'rss',
    url TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    crawl_interval_minutes INTEGER NOT NULL DEFAULT 60,
    last_crawled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Articles Table
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES news_sources(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    original_url TEXT NOT NULL,
    canonical_url TEXT,
    author TEXT,
    source_name TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    crawled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    raw_html TEXT,
    content_text TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'zh-CN',
    status article_status NOT NULL DEFAULT 'draft',
    importance importance_level NOT NULL DEFAULT 'medium',
    hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- AI Summaries Table
CREATE TABLE article_ai_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    summary TEXT NOT NULL,
    key_points JSONB NOT NULL DEFAULT '[]',
    keywords JSONB NOT NULL DEFAULT '[]',
    entities JSONB NOT NULL DEFAULT '{}',
    model_name TEXT NOT NULL,
    prompt_version TEXT NOT NULL,
    status job_status NOT NULL DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 1,
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tags Table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Article Categories Junction Table
CREATE TABLE article_categories (
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, category_id)
);

-- Article Tags Junction Table
CREATE TABLE article_tags (
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

-- Crawl Jobs Table
CREATE TABLE crawl_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES news_sources(id) ON DELETE CASCADE,
    status job_status NOT NULL DEFAULT 'pending',
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    finished_at TIMESTAMP WITH TIME ZONE,
    total_found INTEGER NOT NULL DEFAULT 0,
    total_created INTEGER NOT NULL DEFAULT 0,
    total_duplicated INTEGER NOT NULL DEFAULT 0,
    error_message TEXT
);

-- AI Jobs Table
CREATE TABLE ai_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    job_type ai_job_type NOT NULL,
    status job_status NOT NULL DEFAULT 'pending',
    input_tokens INTEGER,
    output_tokens INTEGER,
    cost DECIMAL(10, 6),
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    finished_at TIMESTAMP WITH TIME ZONE
);

-- Feishu Webhooks Table
CREATE TABLE feishu_webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    webhook_url TEXT NOT NULL,
    secret TEXT,
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Feishu Push Logs Table
CREATE TABLE feishu_push_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
    webhook_id UUID NOT NULL REFERENCES feishu_webhooks(id) ON DELETE CASCADE,
    push_type push_type NOT NULL,
    status job_status NOT NULL,
    request_payload JSONB NOT NULL,
    response_body TEXT,
    pushed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    error_message TEXT
);

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    role user_role NOT NULL DEFAULT 'viewer',
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Daily Digests Table
CREATE TABLE daily_digests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    digest_date DATE NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status digest_status NOT NULL DEFAULT 'draft',
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Article Similarities Table (for future use)
CREATE TABLE article_similarities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    similar_article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    similarity_score DECIMAL(3, 2) NOT NULL CHECK (similarity_score >= 0 AND similarity_score <= 1),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(article_id, similar_article_id)
);

-- Create indexes for better performance
CREATE INDEX idx_articles_source_id ON articles(source_id);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_importance ON articles(importance);
CREATE INDEX idx_articles_hash ON articles(hash);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);
CREATE UNIQUE INDEX idx_articles_hash_unique ON articles(hash);

CREATE INDEX idx_article_ai_summaries_article_id ON article_ai_summaries(article_id);
CREATE INDEX idx_article_ai_summaries_status ON article_ai_summaries(status);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_enabled ON categories(enabled);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);

CREATE INDEX idx_tags_slug ON tags(slug);

CREATE INDEX idx_crawl_jobs_source_id ON crawl_jobs(source_id);
CREATE INDEX idx_crawl_jobs_status ON crawl_jobs(status);
CREATE INDEX idx_crawl_jobs_started_at ON crawl_jobs(started_at DESC);

CREATE INDEX idx_ai_jobs_article_id ON ai_jobs(article_id);
CREATE INDEX idx_ai_jobs_status ON ai_jobs(status);
CREATE INDEX idx_ai_jobs_job_type ON ai_jobs(job_type);

CREATE INDEX idx_feishu_webhooks_enabled ON feishu_webhooks(enabled);

CREATE INDEX idx_feishu_push_logs_webhook_id ON feishu_push_logs(webhook_id);
CREATE INDEX idx_feishu_push_logs_pushed_at ON feishu_push_logs(pushed_at DESC);
CREATE INDEX idx_feishu_push_logs_status ON feishu_push_logs(status);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_news_sources_updated_at BEFORE UPDATE ON news_sources FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_article_ai_summaries_updated_at BEFORE UPDATE ON article_ai_summaries FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_feishu_webhooks_updated_at BEFORE UPDATE ON feishu_webhooks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();