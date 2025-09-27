// Cloudflare Pages Function for dynamic news routes
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
  // List of known static pages that should be served from build
  const knownStaticPages = [
    'dynamic-route-test-post-creation-verification',
    'beautiful-ui-test-final-solution',
    'beautiful-dynamic-post-test',
    'final-solution-test-perfect-ui',
    'test-final-clean-configuration',
    'van-chuyen-duong-bo-chinh-ngach-lua-chon-toi-uu-khi-nhap-hang-trung-quoc'
  ];

  if (knownStaticPages.includes(slug)) {
    console.log(`✅ ${slug} is a known static page, redirecting to static version`);

    // Redirect to the static page with trailing slash
    const staticUrl = new URL(url);
    staticUrl.pathname = `/news/${slug}/`;
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

  console.log(`❌ ${slug} is not a known static page, using dynamic rendering`);

  // PRIORITY 2: Use dynamic Function rendering for new/dynamic content
  console.log(`🔄 Using dynamic Function rendering for ${slug}`);

  try {
    // Fetch news post from API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(`${API_URL}/api/news/by-slug/${slug}?lang=${lang}`, {
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
      
      // Return HTML page with beautiful styling matching Huangshan design system
      const html = `
<!DOCTYPE html>
<html lang="${lang}" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title || 'News Article'} - Huang Shan Global</title>
    <meta name="description" content="${(post.excerpt || '').replace(/"/g, '&quot;')}">
    <meta name="keywords" content="logistics news, China Vietnam logistics, shipping news, ${post.category || 'logistics'}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="${post.author || 'Huang Shan Global'}">
    <link rel="canonical" href="https://huang-shan-global-fe.pages.dev/news/${slug}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- Open Graph -->
    <meta property="og:title" content="${(post.title || 'News Article').replace(/"/g, '&quot;')} - Huang Shan Global">
    <meta property="og:description" content="${(post.excerpt || '').replace(/"/g, '&quot;')}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://huang-shan-global-fe.pages.dev/news/${slug}">
    <meta property="og:site_name" content="Huang Shan Global">
    <meta property="og:locale" content="${lang === 'en' ? 'en_US' : lang === 'cn' ? 'zh_CN' : 'vi_VN'}">
    ${post.featured_image ? `<meta property="og:image" content="${post.featured_image}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${(post.title || 'News Article').replace(/"/g, '&quot;')}">` : `<meta property="og:image" content="https://huang-shan-global-fe.pages.dev/images/og-default.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Huang Shan Global News">`}
    ${post.created_at ? `<meta property="article:published_time" content="${post.created_at}">` : ''}
    ${post.updated_at ? `<meta property="article:modified_time" content="${post.updated_at}">` : ''}
    <meta property="article:author" content="${post.author || 'Huang Shan Global'}">
    <meta property="article:section" content="${post.category || 'News'}">
    <meta property="article:tag" content="logistics">
    <meta property="article:tag" content="China Vietnam">
    <meta property="article:tag" content="shipping">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@HuangShanGlobal">
    <meta name="twitter:title" content="${(post.title || 'News Article').replace(/"/g, '&quot;')} - Huang Shan Global">
    <meta name="twitter:description" content="${(post.excerpt || '').replace(/"/g, '&quot;')}">
    ${post.featured_image ? `<meta name="twitter:image" content="${post.featured_image}">` : '<meta name="twitter:image" content="https://huang-shan-global-fe.pages.dev/images/og-default.jpg">'}

    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "${(post.title || 'News Article').replace(/"/g, '\\"')}",
      "description": "${(post.excerpt || '').replace(/"/g, '\\"')}",
      "image": "${post.featured_image || 'https://huang-shan-global-fe.pages.dev/images/og-default.jpg'}",
      "author": {
        "@type": "Organization",
        "name": "${post.author || 'Huang Shan Global'}"
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
        "@id": "https://huang-shan-global-fe.pages.dev/news/${slug}"
      },
      "articleSection": "${post.category || 'News'}",
      "keywords": "logistics news, China Vietnam logistics, shipping news, ${post.category || 'logistics'}"
    }
    </script>

    <style>
        :root {
            /* Huangshan Color System */
            --primary-50: #f0f7f2;
            --primary-100: #dbeee1;
            --primary-500: #2d5a3d;
            --primary-600: #234a32;
            --primary-700: #1a3a27;
            --primary-800: #122a1d;
            --primary-900: #0a1a12;
            --sage-50: #f7f8f7;
            --sage-100: #eef0ed;
            --sage-400: #a8b5a4;
            --sage-500: #8a9487;
            --secondary-500: #4a7c59;
            --accent-500: #6b9b7a;

            /* Design system colors */
            --background: #f7f8f7;
            --foreground: #0a1a12;
            --card: #ffffff;
            --card-foreground: #0a1a12;
            --muted: #eef0ed;
            --muted-foreground: #8a9487;
            --border: #dbeee1;
            --ring: #2d5a3d;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: var(--foreground);
            background: var(--background);
            font-size: 16px;
            min-height: 100vh;
        }

        /* Header */
        .header {
            position: sticky;
            top: 0;
            z-index: 50;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            border-bottom: 1px solid var(--border);
            padding: 1rem 0;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1.5rem;
        }

        .nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--primary-600);
            text-decoration: none;
            font-weight: 500;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            transition: all 0.2s ease;
            border: 1px solid var(--border);
        }

        .back-link:hover {
            background: var(--primary-50);
            color: var(--primary-700);
            transform: translateY(-1px);
        }

        .breadcrumb {
            color: var(--muted-foreground);
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        /* Main Content */
        .main-content {
            padding: 2rem 0;
        }

        .article {
            background: var(--card);
            border-radius: 1rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            overflow: hidden;
            border: 1px solid var(--border);
        }

        .article-header {
            padding: 3rem;
            border-bottom: 1px solid var(--border);
            background: linear-gradient(135deg, var(--sage-50) 0%, var(--primary-50) 100%);
        }

        .title {
            font-size: clamp(2rem, 5vw, 3.5rem);
            font-weight: 800;
            color: var(--primary-800);
            margin-bottom: 1.5rem;
            line-height: 1.2;
            letter-spacing: -0.025em;
        }

        .meta {
            display: flex;
            align-items: center;
            gap: 2rem;
            flex-wrap: wrap;
            margin-bottom: 1.5rem;
        }

        .meta-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--muted-foreground);
            font-size: 0.875rem;
            font-weight: 500;
        }

        .meta-icon {
            width: 1rem;
            height: 1rem;
            opacity: 0.8;
        }

        .category-badge {
            background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 2rem;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            box-shadow: 0 2px 4px rgba(45, 90, 61, 0.2);
        }

        .featured-badge {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 2rem;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
        }

        .excerpt {
            font-size: 1.125rem;
            color: var(--muted-foreground);
            font-style: italic;
            line-height: 1.7;
            padding: 1.5rem;
            background: var(--muted);
            border-radius: 0.75rem;
            border-left: 4px solid var(--primary-500);
        }

        /* Article Content */
        .article-content {
            padding: 3rem;
            font-size: 1.125rem;
            line-height: 1.8;
            color: var(--card-foreground);
        }

        .article-content h1,
        .article-content h2,
        .article-content h3,
        .article-content h4,
        .article-content h5,
        .article-content h6 {
            margin: 2.5rem 0 1.5rem 0;
            color: var(--primary-800);
            font-weight: 700;
            line-height: 1.3;
        }

        .article-content h1 { font-size: 2.25rem; }
        .article-content h2 { font-size: 1.875rem; }
        .article-content h3 { font-size: 1.5rem; }
        .article-content h4 { font-size: 1.25rem; }

        .article-content p {
            margin-bottom: 1.5rem;
            text-align: justify;
        }

        .article-content img {
            max-width: 100%;
            height: auto;
            border-radius: 0.75rem;
            margin: 2rem auto;
            display: block;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .article-content blockquote {
            border-left: 4px solid var(--primary-500);
            padding: 1.5rem;
            margin: 2rem 0;
            background: var(--primary-50);
            border-radius: 0 0.5rem 0.5rem 0;
            font-style: italic;
            color: var(--primary-700);
            position: relative;
        }

        .article-content blockquote::before {
            content: '"';
            font-size: 4rem;
            color: var(--primary-500);
            position: absolute;
            top: -0.5rem;
            left: 1rem;
            opacity: 0.3;
        }

        .article-content ul,
        .article-content ol {
            margin: 1.5rem 0;
            padding-left: 2rem;
        }

        .article-content li {
            margin-bottom: 0.75rem;
            line-height: 1.7;
        }

        .article-content a {
            color: var(--primary-600);
            text-decoration: underline;
            text-decoration-color: var(--primary-300);
            text-underline-offset: 2px;
            transition: all 0.2s ease;
        }

        .article-content a:hover {
            color: var(--primary-700);
            text-decoration-color: var(--primary-500);
        }

        .article-content code {
            background: var(--muted);
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.875em;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }

        .article-content pre {
            background: var(--muted);
            padding: 1.5rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1.5rem 0;
            border: 1px solid var(--border);
        }

        /* Footer */
        .article-footer {
            padding: 2rem 3rem;
            background: var(--sage-50);
            border-top: 1px solid var(--border);
        }

        .share-section {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .share-text {
            font-weight: 600;
            color: var(--primary-700);
        }

        .share-buttons {
            display: flex;
            gap: 0.75rem;
        }

        .share-button {
            padding: 0.5rem;
            border-radius: 0.5rem;
            background: var(--card);
            border: 1px solid var(--border);
            color: var(--muted-foreground);
            text-decoration: none;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2.5rem;
            height: 2.5rem;
        }

        .share-button:hover {
            background: var(--primary-500);
            color: white;
            transform: translateY(-2px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .container {
                padding: 0 1rem;
            }

            .article-header,
            .article-content,
            .article-footer {
                padding: 1.5rem;
            }

            .title {
                font-size: 2rem;
                margin-bottom: 1rem;
            }

            .meta {
                flex-direction: column;
                align-items: flex-start;
                gap: 1rem;
            }

            .article-content {
                font-size: 1rem;
            }

            .nav {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.75rem;
            }
        }

        @media (max-width: 480px) {
            .main-content {
                padding: 1rem 0;
            }

            .article {
                border-radius: 0.5rem;
            }
        }

        /* Animation */
        .article {
            animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Print Styles */
        @media print {
            .header,
            .article-footer {
                display: none;
            }

            .article {
                box-shadow: none;
                border: none;
            }

            .article-content {
                font-size: 12pt;
                line-height: 1.5;
            }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <nav class="nav">
                <a href="/news" class="back-link">
                    ← ${lang === 'en' ? 'Back to News' : lang === 'cn' ? '返回新闻' : 'Quay lại tin tức'}
                </a>
                <div class="breadcrumb">
                    <span>${lang === 'en' ? 'News' : lang === 'cn' ? '新闻' : 'Tin tức'}</span>
                    <span>•</span>
                    <span>${post.category || (lang === 'en' ? 'General' : lang === 'cn' ? '综合' : 'Chung')}</span>
                </div>
            </nav>
        </div>
    </header>

    <main class="main-content">
        <div class="container">
            <article class="article">
                <header class="article-header">
                    <h1 class="title">${post.title || (lang === 'en' ? 'News Article' : lang === 'cn' ? '新闻文章' : 'Bài viết tin tức')}</h1>

                    <div class="meta">
                        <div class="meta-item">
                            <span class="meta-icon">📅</span>
                            <span>${lang === 'en' ? 'Published' : lang === 'cn' ? '发布于' : 'Xuất bản'}: ${new Date(post.created_at).toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'cn' ? 'zh-CN' : 'vi-VN')}</span>
                        </div>
                        <div class="meta-item">
                            <span class="category-badge">${post.category || (lang === 'en' ? 'General' : lang === 'cn' ? '综合' : 'Chung')}</span>
                        </div>
                        ${post.author ? `
                        <div class="meta-item">
                            <span class="meta-icon">✍️</span>
                            <span>${lang === 'en' ? 'By' : lang === 'cn' ? '作者' : 'Bởi'} ${post.author}</span>
                        </div>
                        ` : ''}
                        ${post.featured ? `
                        <div class="meta-item">
                            <span class="featured-badge">${lang === 'en' ? 'Featured' : lang === 'cn' ? '精选' : 'Nổi bật'}</span>
                        </div>
                        ` : ''}
                    </div>

                    ${post.excerpt ? `
                    <div class="excerpt">
                        ${post.excerpt}
                    </div>
                    ` : ''}
                </header>

                <div class="article-content">
                    ${post.content_html || post.content || `<p>${lang === 'en' ? 'Content not available' : lang === 'cn' ? '内容不可用' : 'Nội dung không có sẵn'}</p>`}
                </div>

                <footer class="article-footer">
                    <div class="share-section">
                        <span class="share-text">${lang === 'en' ? 'Share this article' : lang === 'cn' ? '分享这篇文章' : 'Chia sẻ bài viết'}</span>
                        <div class="share-buttons">
                            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://huang-shan-global-fe.pages.dev/news/${slug}`)}" target="_blank" rel="noopener" class="share-button" title="Facebook">
                                📘
                            </a>
                            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title || 'News Article')}&url=${encodeURIComponent(`https://huang-shan-global-fe.pages.dev/news/${slug}`)}" target="_blank" rel="noopener" class="share-button" title="Twitter">
                                🐦
                            </a>
                            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://huang-shan-global-fe.pages.dev/news/${slug}`)}" target="_blank" rel="noopener" class="share-button" title="LinkedIn">
                                💼
                            </a>
                        </div>
                    </div>
                </footer>
            </article>
        </div>
    </main>
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
    <title>News Article Not Found - Huang Shan Global</title>
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
            display: inline-block; background: #3b82f6; color: white;
            padding: 12px 24px; border-radius: 8px; text-decoration: none;
            font-weight: 500; transition: background 0.2s;
        }
        .back-link:hover { background: #2563eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-code">404</div>
        <h1 class="error-title">News Article Not Found</h1>
        <p class="error-description">
            The news article you're looking for doesn't exist or has been removed.
        </p>
        <a href="/news" class="back-link">← Back to News</a>
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
    console.error('Error in news function:', {
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
            display: inline-block; background: #3b82f6; color: white;
            padding: 12px 24px; border-radius: 8px; text-decoration: none;
            font-weight: 500; transition: background 0.2s;
        }
        .back-link:hover { background: #2563eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-code">503</div>
        <h1 class="error-title">Service Temporarily Unavailable</h1>
        <p class="error-description">
            We're experiencing technical difficulties. Please try again in a few moments.
        </p>
        <a href="/news" class="back-link">← Back to News</a>
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
