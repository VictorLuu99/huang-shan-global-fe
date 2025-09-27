// Cloudflare Pages Function for dynamic knowledge routes
export async function onRequest({ params, request, env }) {
  const slug = params.slug;
  const API_URL = env.NEXT_PUBLIC_API_URL || "https://huangshan-api.xox-labs-server.workers.dev";

  // Validate slug parameter
  if (!slug || typeof slug !== 'string' || slug.length < 1) {
    return new Response('Invalid slug parameter', {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }

  // Extract language from query params or use default
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'vn';

  // PRIORITY 1: Check if static file exists first
  // List of known static knowledge pages that should be served from build
  const knownStaticPages = [
    // Add any static knowledge pages here when they exist in the build
    // Currently all knowledge pages are dynamic
  ];

  if (knownStaticPages.includes(slug)) {
    console.log(`✅ ${slug} is a known static knowledge page, redirecting to static version`);

    // Redirect to the static page with trailing slash
    const staticUrl = new URL(url);
    staticUrl.pathname = `/knowledge/${slug}/`;
    staticUrl.search = ''; // Remove query params

    return new Response(null, {
      status: 302,
      headers: {
        'Location': staticUrl.toString(),
        'Cache-Control': 'public, max-age=300',
        'X-Static-Redirect': 'true'
      }
    });
  }

  console.log(`❌ ${slug} is not a known static knowledge page, using dynamic rendering`);

  // PRIORITY 2: Use dynamic Function rendering for new/dynamic content
  console.log(`🔄 Using dynamic Function rendering for knowledge ${slug}`);

  try {
    // Fetch knowledge post from API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(`${API_URL}/api/knowledge/by-slug/${slug}?lang=${lang}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Huang-Shan-Website/1.0'
      }
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const post = data.data;

      // Validate post data
      if (!post || !post.title) {
        throw new Error('Invalid post data received');
      }
      
      // Return HTML page with beautiful styling that matches Next.js design
      const html = `
<!DOCTYPE html>
<html lang="vn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title || 'Knowledge Article'} - Huang Shan Global</title>
    <meta name="description" content="${post.excerpt || ''}">
    <meta name="keywords" content="logistics knowledge, China Vietnam logistics, import export guide, ${post.category || 'logistics'}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="Huang Shan Global">
    <link rel="canonical" href="https://huang-shan-global-fe.pages.dev/knowledge/${slug}">

    <!-- Open Graph -->
    <meta property="og:title" content="${(post.title || 'Knowledge Article').replace(/"/g, '&quot;')} - Huang Shan Global">
    <meta property="og:description" content="${(post.excerpt || '').replace(/"/g, '&quot;')}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://huang-shan-global-fe.pages.dev/knowledge/${slug}">
    <meta property="og:site_name" content="Huang Shan Global">
    <meta property="og:locale" content="${lang === 'en' ? 'en_US' : lang === 'cn' ? 'zh_CN' : 'vi_VN'}">
    ${post.featured_image ? `<meta property="og:image" content="${post.featured_image}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${(post.title || 'Knowledge Article').replace(/"/g, '&quot;')}">` : `<meta property="og:image" content="https://huang-shan-global-fe.pages.dev/images/og-default.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Huang Shan Global Knowledge">`}
    ${post.created_at ? `<meta property="article:published_time" content="${post.created_at}">` : ''}
    ${post.updated_at ? `<meta property="article:modified_time" content="${post.updated_at}">` : ''}
    <meta property="article:author" content="Huang Shan Global">
    <meta property="article:section" content="${post.category || 'Knowledge'}">
    <meta property="article:tag" content="logistics">
    <meta property="article:tag" content="China Vietnam">
    <meta property="article:tag" content="import export">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@HuangShanGlobal">
    <meta name="twitter:title" content="${(post.title || 'Knowledge Article').replace(/"/g, '&quot;')} - Huang Shan Global">
    <meta name="twitter:description" content="${(post.excerpt || '').replace(/"/g, '&quot;')}">
    ${post.featured_image ? `<meta name="twitter:image" content="${post.featured_image}">` : '<meta name="twitter:image" content="https://huang-shan-global-fe.pages.dev/images/og-default.jpg">'}

    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${(post.title || 'Knowledge Article').replace(/"/g, '\\"')}",
      "description": "${(post.excerpt || '').replace(/"/g, '\\"')}",
      "image": "${post.featured_image || 'https://huang-shan-global-fe.pages.dev/images/og-default.jpg'}",
      "author": {
        "@type": "Organization",
        "name": "Huang Shan Global"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Huang Shan Global",
        "logo": {
          "@type": "ImageObject",
          "url": "https://huang-shan-global-fe.pages.dev/images/logo.png"
        }
      },
      "datePublished": "${post.created_at || new Date().toISOString()}",
      ${post.updated_at ? `"dateModified": "${post.updated_at}",` : ''}
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://huang-shan-global-fe.pages.dev/knowledge/${slug}"
      },
      "articleSection": "${post.category || 'Knowledge'}",
      "keywords": "logistics knowledge, China Vietnam logistics, import export guide, ${post.category || 'logistics'}"
    }
    </script>
    
    <!-- Google Fonts: Inter for modern typography -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    <style>
        :root {
            /* Huangshan Color System */
            --primary-50: #f0f7f2;
            --primary-100: #dceed0;
            --primary-200: #bcdca8;
            --primary-300: #8fc374;
            --primary-400: #68a845;
            --primary-500: #4d8b2d;
            --primary-600: #3a6f22;
            --primary-700: #2f571d;
            --primary-800: #28461c;
            --primary-900: #24391b;

            /* Knowledge-specific brand colors */
            --knowledge-primary: #10b981;
            --knowledge-primary-dark: #059669;
            --knowledge-secondary: #f59e0b;
            --knowledge-accent: #8b5cf6;

            /* Neutral colors for professional appearance */
            --background: #f7f8f7;
            --foreground: #0a1a12;
            --card: #ffffff;
            --card-foreground: #0a1a12;
            --border: #e5e7eb;
            --input: #e5e7eb;
            --ring: #4d8b2d;

            /* Text colors */
            --muted: #6b7280;
            --muted-foreground: #6b7280;
            --accent: #f1f5f9;
            --accent-foreground: #0f172a;

            /* Interactive states */
            --destructive: #dc2626;
            --destructive-foreground: #fecaca;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
            line-height: 1.6;
            color: var(--foreground);
            background: linear-gradient(135deg, var(--background) 0%, #f0f7f2 100%);
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
        }

        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border);
            padding: 24px 0;
            margin-bottom: 40px;
            position: sticky;
            top: 0;
            z-index: 10;
        }

        .nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 20px;
        }

        .nav-left {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .back-link {
            color: var(--knowledge-primary);
            text-decoration: none;
            font-weight: 600;
            font-size: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 8px;
            transition: all 0.2s ease;
            border: 1px solid transparent;
        }

        .back-link:hover {
            background: var(--primary-50);
            border-color: var(--knowledge-primary);
            transform: translateX(-2px);
        }

        .breadcrumb {
            color: var(--muted);
            font-size: 14px;
            font-weight: 500;
        }

        .share-buttons {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .share-btn {
            padding: 8px;
            border-radius: 8px;
            border: 1px solid var(--border);
            background: white;
            color: var(--muted);
            text-decoration: none;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
        }

        .share-btn:hover {
            background: var(--primary-50);
            color: var(--knowledge-primary);
            border-color: var(--knowledge-primary);
            transform: translateY(-1px);
        }

        .article {
            background: var(--card);
            border-radius: 20px;
            box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            margin-bottom: 60px;
            border: 1px solid var(--border);
        }

        .article-header {
            padding: 48px 48px 40px;
            background: linear-gradient(135deg, var(--primary-50) 0%, rgba(16, 185, 129, 0.05) 100%);
            border-bottom: 1px solid var(--border);
            position: relative;
        }

        .article-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--knowledge-primary) 0%, var(--knowledge-secondary) 50%, var(--knowledge-accent) 100%);
        }

        .title {
            font-size: clamp(2rem, 5vw, 3.5rem);
            font-weight: 800;
            color: var(--foreground);
            margin-bottom: 24px;
            line-height: 1.1;
            letter-spacing: -0.02em;
        }

        .excerpt {
            font-size: 1.25rem;
            color: var(--muted);
            line-height: 1.6;
            margin-bottom: 32px;
            font-weight: 400;
        }

        .meta {
            display: flex;
            gap: 24px;
            flex-wrap: wrap;
            align-items: center;
        }

        .meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 15px;
            color: var(--muted);
        }

        .meta-icon {
            width: 16px;
            height: 16px;
            opacity: 0.8;
        }

        .category-badge {
            background: var(--knowledge-primary);
            color: white;
            padding: 8px 16px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: none;
        }

        .featured-badge {
            background: linear-gradient(135deg, var(--knowledge-secondary) 0%, #f97316 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: none;
        }

        .reading-time {
            background: var(--accent);
            color: var(--accent-foreground);
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
        }

        .article-content {
            padding: 48px;
            font-size: 18px;
            line-height: 1.8;
            color: var(--card-foreground);
        }

        .article-content h1, .article-content h2, .article-content h3, .article-content h4 {
            margin: 48px 0 24px 0;
            color: var(--foreground);
            font-weight: 700;
            letter-spacing: -0.01em;
            scroll-margin-top: 100px;
        }

        .article-content h1 { font-size: 2.5rem; line-height: 1.2; }
        .article-content h2 { font-size: 2rem; line-height: 1.3; }
        .article-content h3 { font-size: 1.5rem; line-height: 1.4; }
        .article-content h4 { font-size: 1.25rem; line-height: 1.4; }

        .article-content h1:first-child,
        .article-content h2:first-child,
        .article-content h3:first-child {
            margin-top: 0;
        }

        .article-content p {
            margin-bottom: 24px;
            color: var(--muted-foreground);
        }

        .article-content img {
            max-width: 100%;
            height: auto;
            border-radius: 16px;
            margin: 40px 0;
            box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
            border: 1px solid var(--border);
        }

        .article-content blockquote {
            border-left: 4px solid var(--knowledge-primary);
            padding: 20px 24px;
            margin: 32px 0;
            background: var(--primary-50);
            border-radius: 0 12px 12px 0;
            font-style: italic;
            color: var(--muted);
            position: relative;
        }

        .article-content blockquote::before {
            content: '"';
            font-size: 4rem;
            color: var(--knowledge-primary);
            position: absolute;
            top: -10px;
            left: 20px;
            font-family: Georgia, serif;
            opacity: 0.3;
        }

        .article-content ul, .article-content ol {
            margin: 24px 0;
            padding-left: 32px;
        }

        .article-content li {
            margin-bottom: 12px;
            color: var(--muted-foreground);
        }

        .article-content li::marker {
            color: var(--knowledge-primary);
        }

        .article-content a {
            color: var(--knowledge-primary);
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: all 0.2s ease;
        }

        .article-content a:hover {
            border-bottom-color: var(--knowledge-primary);
        }

        .article-content code {
            background: var(--accent);
            padding: 4px 8px;
            border-radius: 6px;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
            font-size: 0.9em;
            color: var(--accent-foreground);
        }

        .article-content pre {
            background: var(--accent);
            padding: 24px;
            border-radius: 12px;
            overflow-x: auto;
            margin: 32px 0;
            border: 1px solid var(--border);
        }

        .article-content pre code {
            background: none;
            padding: 0;
        }

        .article-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 32px 0;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid var(--border);
        }

        .article-content th,
        .article-content td {
            padding: 16px;
            text-align: left;
            border-bottom: 1px solid var(--border);
        }

        .article-content th {
            background: var(--accent);
            font-weight: 600;
            color: var(--accent-foreground);
        }

        .article-content td {
            color: var(--muted-foreground);
        }

        .article-footer {
            padding: 32px 48px;
            background: var(--accent);
            border-top: 1px solid var(--border);
            text-align: center;
        }

        .article-footer p {
            color: var(--muted);
            font-size: 14px;
            margin: 0;
        }

        /* Print styles */
        @media print {
            body { background: white; }
            .header, .share-buttons { display: none; }
            .article { box-shadow: none; }
            .article-content { font-size: 12pt; }
        }

        /* Mobile responsive design */
        @media (max-width: 768px) {
            .container { padding: 0 16px; }
            .header { padding: 16px 0; }
            .nav { flex-direction: column; align-items: flex-start; }
            .share-buttons { order: -1; align-self: flex-end; }
            .article-header, .article-content, .article-footer { padding: 24px; }
            .title { font-size: 2rem; }
            .meta { flex-direction: column; gap: 16px; align-items: flex-start; }
            .article-content { font-size: 16px; }
            .article-content h1 { font-size: 2rem; }
            .article-content h2 { font-size: 1.75rem; }
            .article-content h3 { font-size: 1.5rem; }
        }

        /* Dark mode media query (optional) */
        @media (prefers-color-scheme: dark) {
            /* Could add dark mode styles here if needed */
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <nav class="nav">
                <div class="nav-left">
                    <a href="/knowledge" class="back-link">
                        ← ${lang === 'en' ? 'Back to Knowledge' : lang === 'cn' ? '返回知识库' : 'Quay lại Kiến thức'}
                    </a>
                    <span class="breadcrumb">/ ${lang === 'en' ? 'Knowledge' : lang === 'cn' ? '知识库' : 'Kiến thức'} / ${post.category || (lang === 'en' ? 'General' : lang === 'cn' ? '通用' : 'Chung')}</span>
                </div>
                <div class="share-buttons">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://huang-shan-global-fe.pages.dev/knowledge/${slug}`)}" target="_blank" rel="noopener noreferrer" class="share-btn" title="${lang === 'en' ? 'Share on Facebook' : lang === 'cn' ? '分享到Facebook' : 'Chia sẻ trên Facebook'}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </a>
                    <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://huang-shan-global-fe.pages.dev/knowledge/${slug}`)}&text=${encodeURIComponent(post.title || 'Knowledge Article')}" target="_blank" rel="noopener noreferrer" class="share-btn" title="${lang === 'en' ? 'Share on Twitter' : lang === 'cn' ? '分享到Twitter' : 'Chia sẻ trên Twitter'}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                    </a>
                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://huang-shan-global-fe.pages.dev/knowledge/${slug}`)}" target="_blank" rel="noopener noreferrer" class="share-btn" title="${lang === 'en' ? 'Share on LinkedIn' : lang === 'cn' ? '分享到LinkedIn' : 'Chia sẻ trên LinkedIn'}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </a>
                    <button onclick="window.print()" class="share-btn" title="${lang === 'en' ? 'Print Article' : lang === 'cn' ? '打印文章' : 'In bài viết'}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6,9 6,2 18,2 18,9"></polyline>
                            <path d="M6,18H4a2,2 0 0,1-2-2v-5a2,2 0 0,1,2-2H20a2,2 0 0,1,2,2v5a2,2 0 0,1-2,2H18"></path>
                            <rect x="6" y="14" width="12" height="8"></rect>
                        </svg>
                    </button>
                </div>
            </nav>
        </header>

        <main>
            <article class="article">
                <header class="article-header">
                    <h1 class="title">${post.title || (lang === 'en' ? 'Knowledge Article' : lang === 'cn' ? '知识文章' : 'Bài viết kiến thức')}</h1>
                    ${post.excerpt ? `<p class="excerpt">${post.excerpt}</p>` : ''}
                    <div class="meta">
                        <div class="meta-item">
                            <svg class="meta-icon" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                            </svg>
                            <span>${lang === 'en' ? 'Published' : lang === 'cn' ? '发布于' : 'Đăng ngày'}: ${new Date(post.created_at).toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'cn' ? 'zh-CN' : 'vi-VN')}</span>
                        </div>
                        ${post.updated_at && post.updated_at !== post.created_at ? `
                        <div class="meta-item">
                            <svg class="meta-icon" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                            </svg>
                            <span>${lang === 'en' ? 'Updated' : lang === 'cn' ? '更新于' : 'Cập nhật'}: ${new Date(post.updated_at).toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'cn' ? 'zh-CN' : 'vi-VN')}</span>
                        </div>
                        ` : ''}
                        <div class="meta-item">
                            <svg class="meta-icon" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                            </svg>
                            <span class="category-badge">${post.category || (lang === 'en' ? 'General' : lang === 'cn' ? '通用' : 'Chung')}</span>
                        </div>
                        ${post.featured ? `
                        <div class="meta-item">
                            <svg class="meta-icon" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                            </svg>
                            <span class="featured-badge">${lang === 'en' ? 'Featured' : lang === 'cn' ? '精选' : 'Nổi bật'}</span>
                        </div>
                        ` : ''}
                        ${post.content ? `
                        <div class="meta-item">
                            <svg class="meta-icon" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                            </svg>
                            <span class="reading-time">${Math.ceil((post.content_html || post.content || '').length / 1000)} ${lang === 'en' ? 'min read' : lang === 'cn' ? '分钟阅读' : 'phút đọc'}</span>
                        </div>
                        ` : ''}
                    </div>
                </header>

                <div class="article-content">
                    ${post.content_html || post.content || `<p>${lang === 'en' ? 'Content not available' : lang === 'cn' ? '内容不可用' : 'Nội dung không khả dụng'}</p>`}
                </div>

                <footer class="article-footer">
                    <p>&copy; ${new Date().getFullYear()} Huang Shan Global. ${lang === 'en' ? 'All rights reserved.' : lang === 'cn' ? '保留所有权利。' : 'Bảo lưu mọi quyền.'}</p>
                </footer>
            </article>
        </main>
    </div>
</body>
</html>`;
      
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400',
          'Vary': 'Accept-Language',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN',
          'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
      });
    } else if (response.status === 404) {
      // Return a proper 404 page
      const notFoundHtml = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Knowledge Article Not Found - Huang Shan Global</title>
    <meta name="robots" content="noindex, nofollow">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f9fafb; color: #1f2937; line-height: 1.6;
        }
        .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; text-align: center; }
        .error-code { font-size: 6rem; font-weight: 800; color: #dc2626; margin-bottom: 20px; }
        .error-title { font-size: 2rem; font-weight: 600; margin-bottom: 20px; }
        .error-description { font-size: 1.1rem; color: #6b7280; margin-bottom: 40px; }
        .back-link {
            display: inline-block; background: #10b981; color: white;
            padding: 12px 24px; border-radius: 8px; text-decoration: none;
            font-weight: 500; transition: background 0.2s;
        }
        .back-link:hover { background: #059669; }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-code">404</div>
        <h1 class="error-title">Knowledge Article Not Found</h1>
        <p class="error-description">
            The knowledge article you're looking for doesn't exist or has been removed.
        </p>
        <a href="/knowledge" class="back-link">← Back to Knowledge</a>
    </div>
</body>
</html>`;
      return new Response(notFoundHtml, {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=300'
        }
      });
    } else {
      // Handle other HTTP errors
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error in knowledge function:', {
      slug,
      lang,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // Return user-friendly error page
    const errorHtml = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Service Temporarily Unavailable - Huang Shan Global</title>
    <meta name="robots" content="noindex, nofollow">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f9fafb; color: #1f2937; line-height: 1.6;
        }
        .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; text-align: center; }
        .error-code { font-size: 6rem; font-weight: 800; color: #f59e0b; margin-bottom: 20px; }
        .error-title { font-size: 2rem; font-weight: 600; margin-bottom: 20px; }
        .error-description { font-size: 1.1rem; color: #6b7280; margin-bottom: 40px; }
        .back-link {
            display: inline-block; background: #10b981; color: white;
            padding: 12px 24px; border-radius: 8px; text-decoration: none;
            font-weight: 500; transition: background 0.2s;
        }
        .back-link:hover { background: #059669; }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-code">503</div>
        <h1 class="error-title">Service Temporarily Unavailable</h1>
        <p class="error-description">
            We're experiencing technical difficulties. Please try again in a few moments.
        </p>
        <a href="/knowledge" class="back-link">← Back to Knowledge</a>
    </div>
</body>
</html>`;

    return new Response(errorHtml, {
      status: 503,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Retry-After': '300'
      }
    });
  }
}
