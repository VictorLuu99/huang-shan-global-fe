/**
 * Content Formatting Utility
 * Converts plain text content from admin panel to properly formatted HTML
 * Preserves line breaks, indentation, and basic formatting
 */

export interface FormattingOptions {
  preserveLineBreaks?: boolean;
  preserveIndentation?: boolean;
  convertUrls?: boolean;
  allowBasicMarkdown?: boolean;
}

/**
 * Format plain text content to HTML while preserving formatting
 */
export function formatContent(
  content: string | null | undefined, 
  options: FormattingOptions = {}
): string {
  if (!content) return '';

  const {
    preserveLineBreaks = true,
    preserveIndentation = true,
    convertUrls = true,
    allowBasicMarkdown = true
  } = options;

  let formattedContent = content;

  // Escape HTML entities to prevent XSS
  formattedContent = formattedContent
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  // Convert line breaks to HTML
  if (preserveLineBreaks) {
    // Convert double line breaks to paragraphs
    formattedContent = formattedContent
      .split(/\n\s*\n/)
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .map(paragraph => {
        // Convert single line breaks within paragraphs to <br>
        const withBreaks = paragraph.replace(/\n/g, '<br>');
        return `<p>${withBreaks}</p>`;
      })
      .join('\n');
  }

  // Preserve indentation using CSS
  if (preserveIndentation) {
    formattedContent = formattedContent.replace(/^([ \t]+)/gm, (match) => {
      const spaces = match.replace(/\t/g, '    '); // Convert tabs to 4 spaces
      return `<span style="padding-left: ${spaces.length * 0.5}em; display: inline-block;"></span>`;
    });
  }

  // Convert URLs to clickable links
  if (convertUrls) {
    const urlRegex = /(https?:\/\/[^\s<>"]+)/gi;
    formattedContent = formattedContent.replace(urlRegex, 
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>'
    );
  }

  // Basic markdown support
  if (allowBasicMarkdown) {
    // Bold text **text** or __text__
    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedContent = formattedContent.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Italic text *text* or _text_
    formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
    formattedContent = formattedContent.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Code inline `code`
    formattedContent = formattedContent.replace(/`([^`]+)`/g, 
      '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>'
    );
    
    // Headings ### Heading
    formattedContent = formattedContent.replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>');
    formattedContent = formattedContent.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mt-8 mb-4">$1</h2>');
    formattedContent = formattedContent.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-10 mb-5">$1</h1>');
    
    // Lists - Simple bullet points starting with - or *
    formattedContent = formattedContent.replace(/^[*-] (.*)$/gm, '<li class="ml-4">• $1</li>');
    
    // Numbered lists 1. 2. 3.
    formattedContent = formattedContent.replace(/^\d+\. (.*)$/gm, '<li class="ml-4 list-decimal">$1</li>');
  }

  return formattedContent;
}

/**
 * Format content specifically for knowledge posts
 * Includes additional Vietnamese text formatting
 */
export function formatKnowledgeContent(content: string | null | undefined): string {
  if (!content) return '';

  let formatted = formatContent(content, {
    preserveLineBreaks: true,
    preserveIndentation: true,
    convertUrls: true,
    allowBasicMarkdown: true
  });

  // Vietnamese-specific formatting improvements
  // Add proper spacing around Vietnamese punctuation
  formatted = formatted
    .replace(/([.!?])\s*\n/g, '$1\n\n') // Ensure paragraph breaks after sentences
    .replace(/:\s*\n/g, ':\n') // Handle colons before lists
    .replace(/([0-9]+)\.\s/g, '<strong>$1.</strong> '); // Bold numbered steps

  // Wrap in a container with proper Vietnamese typography
  return `<div class="vietnamese-content space-y-4 leading-relaxed">${formatted}</div>`;
}

/**
 * Sanitize content to prevent XSS while preserving formatting
 */
export function sanitizeHtml(html: string): string {
  // Allow only safe HTML tags

  // Simple sanitization - in production, use a library like DOMPurify
  let sanitized = html;
  
  // Remove script tags completely
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove on* event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*"[^"]*"/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*'[^']*'/gi, '');
  
  return sanitized;
}

/**
 * Preview text for content (remove HTML tags, limit length)
 */
export function getContentPreview(content: string | null | undefined, length = 200): string {
  if (!content) return '';
  
  // Strip HTML tags
  const stripped = content.replace(/<[^>]*>/g, '');
  
  // Limit length
  if (stripped.length <= length) return stripped;
  
  return stripped.substring(0, length).trim() + '...';
}