-- Enable Row Level Security (RLS) for all tables
ALTER TABLE news_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_ai_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE crawl_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feishu_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE feishu_push_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_digests ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_similarities ENABLE ROW LEVEL SECURITY;

-- Helper function to check user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
DECLARE
    user_role_val user_role;
BEGIN
    SELECT role INTO user_role_val
    FROM users
    WHERE id = auth.uid()::uuid;
    
    RETURN COALESCE(user_role_val, 'viewer');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user can edit
CREATE OR REPLACE FUNCTION can_edit()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() IN ('admin', 'editor');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- News Sources Policies
CREATE POLICY "Users can view news sources" ON news_sources
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins can insert news sources" ON news_sources
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update news sources" ON news_sources
    FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete news sources" ON news_sources
    FOR DELETE USING (is_admin());

-- Articles Policies
CREATE POLICY "Users can view published articles" ON articles
    FOR SELECT USING (status = 'published' OR can_edit());

CREATE POLICY "Editors can insert articles" ON articles
    FOR INSERT WITH CHECK (can_edit());

CREATE POLICY "Editors can update articles" ON articles
    FOR UPDATE USING (can_edit());

CREATE POLICY "Admins can delete articles" ON articles
    FOR DELETE USING (is_admin());

-- Article AI Summaries Policies
CREATE POLICY "Users can view AI summaries" ON article_ai_summaries
    FOR SELECT USING (TRUE);

CREATE POLICY "System can insert AI summaries" ON article_ai_summaries
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "System can update AI summaries" ON article_ai_summaries
    FOR UPDATE USING (TRUE);

CREATE POLICY "Admins can delete AI summaries" ON article_ai_summaries
    FOR DELETE USING (is_admin());

-- Categories Policies
CREATE POLICY "Users can view enabled categories" ON categories
    FOR SELECT USING (enabled = true OR can_edit());

CREATE POLICY "Admins can insert categories" ON categories
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update categories" ON categories
    FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete categories" ON categories
    FOR DELETE USING (is_admin());

-- Tags Policies
CREATE POLICY "Users can view tags" ON tags
    FOR SELECT USING (TRUE);

CREATE POLICY "Editors can insert tags" ON tags
    FOR INSERT WITH CHECK (can_edit());

CREATE POLICY "Editors can update tags" ON tags
    FOR UPDATE USING (can_edit());

CREATE POLICY "Admins can delete tags" ON tags
    FOR DELETE USING (is_admin());

-- Article Categories Policies
CREATE POLICY "Users can view article categories" ON article_categories
    FOR SELECT USING (TRUE);

CREATE POLICY "Editors can manage article categories" ON article_categories
    FOR ALL USING (can_edit());

-- Article Tags Policies
CREATE POLICY "Users can view article tags" ON article_tags
    FOR SELECT USING (TRUE);

CREATE POLICY "Editors can manage article tags" ON article_tags
    FOR ALL USING (can_edit());

-- Crawl Jobs Policies
CREATE POLICY "Users can view crawl jobs" ON crawl_jobs
    FOR SELECT USING (TRUE);

CREATE POLICY "System can manage crawl jobs" ON crawl_jobs
    FOR ALL USING (TRUE);

-- AI Jobs Policies
CREATE POLICY "Users can view AI jobs" ON ai_jobs
    FOR SELECT USING (TRUE);

CREATE POLICY "System can manage AI jobs" ON ai_jobs
    FOR ALL USING (TRUE);

-- Feishu Webhooks Policies
CREATE POLICY "Users can view enabled webhooks" ON feishu_webhooks
    FOR SELECT USING (enabled = true OR can_edit());

CREATE POLICY "Admins can insert webhooks" ON feishu_webhooks
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update webhooks" ON feishu_webhooks
    FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete webhooks" ON feishu_webhooks
    FOR DELETE USING (is_admin());

-- Feishu Push Logs Policies
CREATE POLICY "Users can view push logs" ON feishu_push_logs
    FOR SELECT USING (TRUE);

CREATE POLICY "System can insert push logs" ON feishu_push_logs
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins can delete push logs" ON feishu_push_logs
    FOR DELETE USING (is_admin());

-- Users Policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (id = auth.uid()::uuid OR is_admin());

CREATE POLICY "Admins can insert users" ON users
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (id = auth.uid()::uuid OR is_admin());

CREATE POLICY "Admins can delete users" ON users
    FOR DELETE USING (is_admin() AND id != auth.uid()::uuid);

-- Daily Digests Policies
CREATE POLICY "Users can view daily digests" ON daily_digests
    FOR SELECT USING (TRUE);

CREATE POLICY "Editors can manage daily digests" ON daily_digests
    FOR ALL USING (can_edit());

-- Article Similarities Policies
CREATE POLICY "Users can view article similarities" ON article_similarities
    FOR SELECT USING (TRUE);

CREATE POLICY "System can manage article similarities" ON article_similarities
    FOR ALL USING (TRUE);