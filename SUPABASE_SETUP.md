# Supabase Database Setup Guide

This guide will help you set up the Supabase database for the WiseVision payment news platform.

## Prerequisites

- A Supabase account (https://supabase.com)
- Node.js and npm/yarn/pnpm installed
- Git (for version control)

## Step 1: Create a New Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Choose your organization
4. Set project name: `wisevision-payment-news`
5. Set database password (save this!)
6. Choose region (closest to your users)
7. Click "Create new project"

## Step 2: Get Your Project Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Anon key** (public key for client-side)
   - **Service role key** (secret key for server-side)

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

## Step 4: Run Database Migrations

### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Run migrations:
   ```bash
   supabase db push
   ```

### Option B: Manual SQL Execution

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Execute the migration files in order:

   **Step 1: Run initial schema**
   - Copy and paste the contents of `supabase/migrations/20240115000001_initial_schema.sql`
   - Click "RUN"

   **Step 2: Run RLS policies**
   - Copy and paste the contents of `supabase/migrations/20240115000002_rls_policies.sql`
   - Click "RUN"

   **Step 3: Run seed data**
   - Copy and paste the contents of `supabase/migrations/20240115000003_seed_data.sql`
   - Click "RUN"

## Step 5: Verify Database Setup

1. Go to **Database** → **Tables** in your Supabase dashboard
2. You should see all the tables created:
   - `articles`
   - `news_sources`
   - `categories`
   - `tags`
   - `article_categories`
   - `article_tags`
   - `crawl_jobs`
   - `ai_jobs`
   - `feishu_webhooks`
   - `feishu_push_logs`
   - `users`
   - `daily_digests`
   - `article_similarities`

3. Check that sample data was inserted:
   - Go to **Database** → **Table Editor**
   - Check `categories` table - should have 10 payment industry categories
   - Check `tags` table - should have various payment-related tags
   - Check `news_sources` table - should have sample news sources

## Step 6: Configure Row Level Security (RLS)

RLS policies are automatically applied by the migration. Verify they're working:

1. Go to **Authentication** → **Policies**
2. You should see policies for each table
3. Test the policies by creating a test user and checking access

## Step 7: Set Up Real-time (Optional)

1. Go to **Database** → **Replication**
2. Enable replication for the tables you want real-time updates:
   - `articles`
   - `crawl_jobs`
   - `ai_jobs`
   - `feishu_push_logs`

## Step 8: Create Admin User

### Option A: Using Supabase Auth (Recommended)

1. Go to **Authentication** → **Users**
2. Click "Add user"
3. Set email: `admin@wisevision.com`
4. Set password (temporary)
5. Send invitation email or set password manually

### Option B: Direct Database Insert

Execute in SQL Editor:
```sql
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at)
VALUES (
  uuid_generate_v4(),
  'admin@wisevision.com',
  NOW(),
  NOW(),
  NOW()
);

-- Get the user ID and insert into users table
INSERT INTO public.users (id, name, email, role)
SELECT auth.users.id, 'Administrator', 'admin@wisevision.com', 'admin'
FROM auth.users
WHERE email = 'admin@wisevision.com';
```

## Step 9: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000
3. Try the following:
   - Navigate to dashboard - should show stats
   - Go to categories page - should show payment categories
   - Go to sources page - should show sample sources
   - Try creating a new category or tag

## Step 10: Configure Additional Services (Optional)

### OpenAI Integration
```env
OPENAI_API_KEY=sk-your_openai_api_key
```

### Feishu Integration
```env
FEISHU_APP_ID=your_feishu_app_id
FEISHU_APP_SECRET=your_feishu_app_secret
```

## Troubleshooting

### Common Issues

1. **Connection errors**: Check your environment variables
2. **RLS errors**: Ensure you have proper authentication
3. **Migration errors**: Check SQL syntax and run migrations in order
4. **Real-time not working**: Verify replication is enabled

### Useful SQL Queries

**Check table sizes:**
```sql
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats
WHERE schemaname = 'public';
```

**Check RLS policies:**
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

**Reset data (development only):**
```sql
-- ⚠️ This will delete all data!
TRUNCATE TABLE 
    articles,
    news_sources,
    crawl_jobs,
    ai_jobs,
    feishu_push_logs,
    daily_digests
CASCADE;
```

## Security Checklist

- [ ] RLS policies are enabled on all tables
- [ ] Service role key is not exposed to client-side
- [ ] Environment variables are properly set
- [ ] Default passwords are changed
- [ ] Database backups are configured
- [ ] SSL connections are enforced

## Performance Tips

1. **Indexes**: The migration includes essential indexes
2. **Connection pooling**: Use Supabase's built-in pooling
3. **Query optimization**: Use `select()` to limit returned fields
4. **Pagination**: Always use pagination for large datasets
5. **Real-time**: Only enable for tables that need it

## Monitoring

1. **Dashboard**: Use Supabase dashboard for monitoring
2. **Logs**: Check database logs for slow queries
3. **Metrics**: Monitor connection count and query performance
4. **Alerts**: Set up alerts for database issues

Your database is now ready for the WiseVision payment news platform!