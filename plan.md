# wen-site 博客系统实施计划

> **架构版本**: v1.0  
> **创建日期**: 2025-02-03  
> **架构负责人**: Matt  
> **技术栈**: SvelteKit 5 + TypeScript + Tailwind CSS 4 + Supabase

---

## 1. 数据库 Schema

### 1.1 表结构概览

```sql
-- profiles 表 (扩展 Supabase Auth 用户)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- posts 表 (博客文章)
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  cover_image text,
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  author_id uuid references public.profiles(id) on delete set null,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  meta_title text,
  meta_description text
);

-- tags 表 (文章标签)
create table public.tags (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  slug text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- post_tags 关联表 (多对多关系)
create table public.post_tags (
  post_id uuid references public.posts(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);
```

### 1.2 索引设计

```sql
-- 性能优化索引
create index idx_posts_slug on public.posts(slug);
create index idx_posts_status on public.posts(status);
create index idx_posts_published_at on public.posts(published_at desc);
create index idx_posts_author on public.posts(author_id);
create index idx_post_tags_post on public.post_tags(post_id);
create index idx_post_tags_tag on public.post_tags(tag_id);
```

### 1.3 TypeScript 类型定义

```typescript
// src/lib/types/database.ts

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  status: 'draft' | 'published' | 'archived';
  author_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  meta_title: string | null;
  meta_description: string | null;
  author?: Profile;
  tags?: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface PostWithTags extends Post {
  tags: Tag[];
  author: Profile | null;
}
```

---

## 2. API 设计

### 2.1 博客文章 API

| 端点 | 方法 | 描述 | 认证要求 |
|------|------|------|----------|
| `/api/posts` | GET | 获取文章列表 (仅 published) | 公开 |
| `/api/posts` | POST | 创建新文章 | Admin |
| `/api/posts/[slug]` | GET | 获取单篇文章 | 公开 (draft 需 admin) |
| `/api/posts/[slug]` | PUT | 更新文章 | Admin |
| `/api/posts/[slug]` | DELETE | 删除文章 | Admin |

#### GET /api/posts
```typescript
// src/routes/api/posts/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const tag = url.searchParams.get('tag');
  
  let query = supabase
    .from('posts')
    .select('*, author:profiles(*), tags:post_tags(tag:tags(*))')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  
  if (tag) {
    query = query.contains('tags.tag.slug', [tag]);
  }
  
  const { data, error, count } = await query;
  
  if (error) return json({ error: error.message }, { status: 500 });
  
  return json({ posts: data, pagination: { page, limit, total: count } });
};
```

#### GET /api/posts/[slug]
```typescript
// src/routes/api/posts/[slug]/+server.ts
export const GET: RequestHandler = async ({ params, locals: { supabase, session } }) => {
  const { slug } = params;
  
  let query = supabase
    .from('posts')
    .select('*, author:profiles(*), tags:post_tags(tag:tags(*))')
    .eq('slug', slug)
    .single();
  
  const { data, error } = await query;
  
  if (error) return json({ error: 'Post not found' }, { status: 404 });
  
  // Draft 文章只有 admin 可查看
  if (data.status === 'draft' && !session?.user?.app_metadata?.role === 'admin') {
    return json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  return json({ post: data });
};
```

### 2.2 Admin API

| 端点 | 方法 | 描述 | 认证要求 |
|------|------|------|----------|
| `/api/admin/posts` | GET | 获取所有文章 (包含 drafts) | Admin |
| `/api/admin/stats` | GET | 获取仪表盘统计数据 | Admin |
| `/api/auth/login` | POST | 管理员登录 | 公开 |
| `/api/auth/logout` | POST | 登出 | 已认证 |

---

## 3. 页面路由

### 3.1 路由结构

```
src/routes/
├── +layout.svelte           # 根布局 (含 Navbar, Footer)
├── +layout.ts               # 根布局数据加载
├── +page.svelte             # 主页 (现有)
├── +error.svelte            # 错误页面
│
├── blog/
│   ├── +page.svelte         # 文章列表页
│   ├── +page.ts             # 文章列表数据加载
│   └── [slug]/
│       ├── +page.svelte     # 单篇文章页
│       └── +page.ts         # 单篇文章数据加载
│
└── admin/
    ├── +layout.svelte       # Admin 布局 (检查认证)
    ├── +layout.ts           # Admin 认证守卫
    │
    ├── login/
    │   └── +page.svelte     # 登录页面
    │
    └── dashboard/
        ├── +page.svelte     # 仪表盘首页
        ├── posts/
        │   ├── +page.svelte # 文章管理列表
        │   └── new/
        │       └── +page.svelte # 新建文章
        └── settings/
            └── +page.svelte # 设置页面
```

### 3.2 路由配置

```typescript
// src/routes/admin/+layout.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
  const { session, profile } = await parent();
  
  if (!session) {
    throw redirect(302, '/admin/login');
  }
  
  if (profile?.role !== 'admin') {
    throw redirect(302, '/');
  }
  
  return { session, profile };
};
```

---

## 4. 认证方案

### 4.1 Supabase Auth 配置

```typescript
// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// src/hooks.server.ts
import { createServerClient } from '@supabase/ssr';

export const handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (key) => event.cookies.get(key),
        set: (key, value, options) => event.cookies.set(key, value, options),
        remove: (key, options) => event.cookies.delete(key, options),
      },
    }
  );
  
  event.locals.getSession = async () => {
    const { data: { session } } = await event.locals.supabase.auth.getSession();
    return session;
  };
  
  return resolve(event);
};
```

### 4.2 登录流程

```typescript
// src/lib/stores/auth.ts
import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase/client';

export const user = writable(null);
export const isAdmin = writable(false);

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
```

### 4.3 环境变量

```bash
# .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 5. 组件架构

### 5.1 组件层级

```
src/lib/components/
├── ui/                      # 基础 UI 组件
│   ├── Button.svelte        # ✓ 现有 - 复用
│   ├── Card.svelte          # ✓ 现有 - 复用
│   ├── Input.svelte         # 新增 - 表单输入
│   ├── TextArea.svelte      # 新增 - 文本域
│   ├── Badge.svelte         # 新增 - 标签徽章
│   └── Loading.svelte       # 新增 - 加载状态
│
├── blog/                    # 博客相关组件
│   ├── ArticleCard.svelte   # 新增 - 文章卡片
│   ├── ArticleContent.svelte # 新增 - 文章内容渲染
│   ├── ArticleList.svelte   # 新增 - 文章列表
│   ├── ArticleMeta.svelte   # 新增 - 文章元信息
│   └── TagCloud.svelte      # 新增 - 标签云
│
├── admin/                   # 后台管理组件
│   ├── LoginForm.svelte     # 新增 - 登录表单
│   ├── AdminNav.svelte      # 新增 - 后台导航
│   ├── PostEditor.svelte    # 新增 - 文章编辑器
│   ├── PostTable.svelte     # 新增 - 文章表格
│   └── StatCard.svelte      # 新增 - 统计卡片
│
└── sections/                # 页面区块组件
    ├── Navbar.svelte        # ✓ 现有 - 需扩展登录入口
    ├── Hero.svelte          # ✓ 现有
    ├── Skills.svelte        # ✓ 现有
    ├── Footer.svelte        # ✓ 现有
    └── ProjectGrid.svelte   # ✓ 现有
```

### 5.2 关键组件规范

#### ArticleCard.svelte
```svelte
<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import type { Post } from '$lib/types/database';
  
  export let post: Post;
  export let featured: boolean = false;
</script>

<article class="article-card" class:featured>
  <Card>
    {#if post.cover_image}
      <img src={post.cover_image} alt={post.title} class="cover" />
    {/if}
    <div class="content">
      <h2><a href="/blog/{post.slug}">{post.title}</a></h2>
      <p class="excerpt">{post.excerpt}</p>
      <div class="meta">
        <time>{new Date(post.published_at).toLocaleDateString()}</time>
        {#if post.tags}
          {#each post.tags as tag}
            <Badge>{tag.name}</Badge>
          {/each}
        {/if}
      </div>
    </div>
  </Card>
</article>
```

#### LoginForm.svelte
```svelte
<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import { signIn } from '$lib/stores/auth';
  
  let email = '';
  let password = '';
  let loading = false;
  let error = '';
  
  async function handleSubmit() {
    loading = true;
    error = '';
    try {
      await signIn(email, password);
      window.location.href = '/admin/dashboard';
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <Input
    type="email"
    label="邮箱"
    bind:value={email}
    required
  />
  <Input
    type="password"
    label="密码"
    bind:value={password}
    required
  />
  {#if error}
    <p class="error">{error}</p>
  {/if}
  <Button type="submit" disabled={loading}>
    {loading ? '登录中...' : '登录'}
  </Button>
</form>
```

---

## 6. 安全考虑

### 6.1 Row Level Security (RLS) 策略

```sql
-- profiles 表策略
alter table public.profiles enable row level security;

-- 用户只能查看自己的 profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- 用户只能更新自己的 profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Admin 可以查看所有 profiles
create policy "Admin can view all profiles"
  on public.profiles for select
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));

-- posts 表策略
alter table public.posts enable row level security;

-- 公开可以查看已发布文章
create policy "Public can view published posts"
  on public.posts for select
  using (status = 'published');

-- Admin 可以查看所有文章
create policy "Admin can view all posts"
  on public.posts for select
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));

-- Admin 可以创建文章
create policy "Admin can create posts"
  on public.posts for insert
  with check (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));

-- Admin 可以更新所有文章
create policy "Admin can update posts"
  on public.posts for update
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));

-- Admin 可以删除文章
create policy "Admin can delete posts"
  on public.posts for delete
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));
```

### 6.2 Admin Middleware

```typescript
// src/lib/middleware/admin.ts
import { redirect, error } from '@sveltejs/kit';
import type { Session, SupabaseClient } from '@supabase/supabase-js';

export async function requireAdmin(
  session: Session | null,
  supabase: SupabaseClient
) {
  if (!session) {
    throw redirect(302, '/admin/login');
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  if (profile?.role !== 'admin') {
    throw error(403, 'Unauthorized');
  }
  
  return profile;
}
```

### 6.3 安全配置清单

- [ ] 启用所有表的 RLS
- [ ] 限制 service_role_key 仅用于 server-side
- [ ] 设置合理的 JWT 过期时间 (默认 3600s)
- [ ] 启用 Supabase Auth 邮件确认 (可选)
- [ ] 使用 HTTPS 在生产环境
- [ ] 实施 rate limiting
- [ ] 验证所有用户输入

---

## 7. 实施步骤 (按优先级)

### Step 1: 环境准备与 Supabase 配置
**预估时间**: 2-3 小时  
**负责人**: DevOps

- [ ] 创建 Supabase 项目
- [ ] 配置环境变量 (.env)
- [ ] 安装依赖: `@supabase/supabase-js`, `@supabase/ssr`
- [ ] 设置 Supabase client (client.ts, server.ts)
- [ ] 创建 hooks.server.ts 初始化 auth
- [ ] 测试连接

**输出物**:
- 可连接的 Supabase client
- 环境变量配置文档

---

### Step 2: 数据库 Schema 与 RLS 策略
**预估时间**: 3-4 小时  
**负责人**: Backend

- [ ] 创建 profiles 表
- [ ] 创建 posts 表
- [ ] 创建 tags 和 post_tags 表
- [ ] 创建所有索引
- [ ] 配置 RLS 策略
- [ ] 创建 database.types.ts (使用 supabase gen types)
- [ ] 插入测试数据

**输出物**:
- 完整的数据库结构
- TypeScript 类型定义
- 测试数据集

---

### Step 3: 基础组件开发
**预估时间**: 4-5 小时  
**负责人**: Frontend

- [ ] Input.svelte (带 label, error state)
- [ ] TextArea.svelte (支持 markdown 预览)
- [ ] Badge.svelte (多种 variant)
- [ ] Loading.svelte (spinner, skeleton)
- [ ] 更新 Button.svelte (添加 loading state)
- [ ] 编写组件 Storybook/Docs

**输出物**:
- 5 个基础 UI 组件
- 组件文档

---

### Step 4: 博客前台页面
**预估时间**: 6-8 小时  
**负责人**: Frontend

- [ ] 创建 ArticleCard 组件
- [ ] 创建 ArticleContent 组件 (markdown 渲染)
- [ ] 创建 /blog 列表页 (+page.svelte, +page.ts)
- [ ] 创建 /blog/[slug] 详情页
- [ ] 更新 Navbar (添加博客入口)
- [ ] 响应式适配
- [ ] SEO 优化 (meta tags)

**输出物**:
- 可访问的博客列表和详情页
- 响应式布局

---

### Step 5: Admin 认证系统
**预估时间**: 5-6 小时  
**负责人**: Full Stack

- [ ] 创建 auth store (user, isAdmin, signIn, signOut)
- [ ] 创建 LoginForm 组件
- [ ] 创建 /admin/login 页面
- [ ] 创建 admin layout guard (+layout.ts)
- [ ] 创建 dashboard 基础布局
- [ ] 测试登录流程

**输出物**:
- 可登录的 admin 系统
- 认证守卫功能

---

### Step 6: Admin Dashboard 功能
**预估时间**: 8-10 小时  
**负责人**: Full Stack

- [ ] 创建 PostEditor 组件 (markdown 编辑器)
- [ ] 创建 PostTable 组件 (列表展示)
- [ ] 创建 /admin/dashboard 首页
- [ ] 创建 /admin/posts 管理页
- [ ] 创建 /admin/posts/new 新建文章页
- [ ] 实现文章 CRUD API
- [ ] 实现图片上传功能
- [ ] 草稿/发布状态切换

**输出物**:
- 完整的管理后台
- 文章管理功能

---

### Step 7: 测试、优化与部署
**预估时间**: 4-6 小时  
**负责人**: QA + DevOps

- [ ] 单元测试 (组件)
- [ ] 集成测试 (API)
- [ ] E2E 测试 (关键流程)
- [ ] 性能优化 (图片懒加载, 代码分割)
- [ ] Lighthouse 评分检查
- [ ] 生产环境部署
- [ ] 编写用户手册

**输出物**:
- 测试报告
- 部署上线版本
- 用户手册

---

## 附录

### A. 技术依赖

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "^0.x",
    "marked": "^12.x",
    "dompurify": "^3.x"
  },
  "devDependencies": {
    "@types/dompurify": "^3.x"
  }
}
```

### B. 目录结构总览

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/
│   │   ├── blog/
│   │   ├── admin/
│   │   └── sections/
│   ├── stores/
│   │   ├── auth.ts
│   │   └── posts.ts
│   ├── types/
│   │   └── database.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils/
│       └── slugify.ts
├── routes/
│   ├── api/
│   ├── blog/
│   ├── admin/
│   └── ...
├── app.html
└── app.d.ts
```

### C. 验收标准

- [ ] 访客可以浏览已发布文章列表
- [ ] 访客可以阅读单篇文章
- [ ] Admin 可以通过邮箱/密码登录
- [ ] Admin 可以创建、编辑、删除文章
- [ ] Admin 可以保存草稿和发布文章
- [ ] 非 Admin 用户无法访问后台
- [ ] 所有页面在移动端正常显示
- [ ] Lighthouse 性能评分 > 90

---

**文档结束**
