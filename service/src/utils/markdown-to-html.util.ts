/**
 * Simple markdown to HTML converter without external libraries
 * Supports basic markdown syntax commonly used in messages:
 * - Headings: # ## ###
 * - Bold: **text** or __text__
 * - Italic: *text* or _text_
 * - Code: `code`
 * - Images: ![alt text](image_url)
 * - Links: [text](url) and <url>
 * - Bullet Lists: - item or * item
 * - Numbered Lists: 1. item 2. item
 * - Line breaks: converted to <br> tags
 * - HTML entities: decoded (&#x64;, &#32;, &amp;, etc.)
 */
export function convertMarkdownToHtml(markdown: string): string {
  if (!markdown) {
    return '';
  }

  let html = markdown;

  // First, handle headings BEFORE converting line breaks
  // Convert headings (# ## ###) - must be at start of line and followed by space
  html = html.replace(
    /^### (.+?)(\n|$)/gm,
    '<h3 style="margin: 20px 0 10px 0; font-size: 18px; font-weight: bold; color: #1d384a;">$1</h3>\n'
  );
  html = html.replace(
    /^## (.+?)(\n|$)/gm,
    '<h2 style="margin: 24px 0 12px 0; font-size: 22px; font-weight: bold; color: #1d384a;">$1</h2>\n'
  );
  html = html.replace(
    /^# (.+?)(\n|$)/gm,
    '<h1 style="margin: 28px 0 16px 0; font-size: 26px; font-weight: bold; color: #1d384a;">$1</h1>\n'
  );

  // Convert bullet points (- or *) - must be at start of line
  html = html.replace(/^[\s]*[\-\*]\s+(.+?)(\n|$)/gm, '<li>$1</li>\n');

  // Convert numbered lists (1. 2. etc.) - must be at start of line
  html = html.replace(/^[\s]*\d+\.\s+(.+?)(\n|$)/gm, '<ol-li>$1</ol-li>\n');

  // Wrap consecutive <li> elements in <ul>
  html = html.replace(
    /(<li>.*?<\/li>(?:\n<li>.*?<\/li>)*)/gs,
    '<ul style="margin: 16px 0; padding-left: 20px; list-style-type: disc;">$1</ul>'
  );

  // Wrap consecutive <ol-li> elements in <ol> and convert to <li>
  html = html.replace(
    /(<ol-li>.*?<\/ol-li>(?:\n<ol-li>.*?<\/ol-li>)*)/gs,
    match => {
      return (
        '<ol style="margin: 16px 0; padding-left: 20px; list-style-type: decimal;">' +
        match.replace(/<ol-li>/g, '<li>').replace(/<\/ol-li>/g, '</li>') +
        '</ol>'
      );
    }
  );

  // Now convert line breaks to HTML breaks
  html = html.replace(/\n/g, '<br>');

  // Convert **bold** and __bold__ to <strong> first
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // Then convert *italic* and _italic_ to <em>
  html = html.replace(/\*([^*<>]+?)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_<>]+?)_/g, '<em>$1</em>');

  // Convert `code` to <code>
  html = html.replace(
    /`(.*?)`/g,
    '<code style="background-color: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 90%;">$1</code>'
  );

  // Convert ![alt](url) images to <img> tags (must be before link conversion)
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]*)\)/g,
    '<img src="$2" alt="$1" style="display: block; max-width: 100%; height: auto; border-radius: 4px; margin: 16px 0; border: 0; outline: none;" />'
  );

  // Convert <url> format links to <a> tags
  html = html.replace(
    /<(https?:\/\/[^>]+)>/g,
    '<a href="$1" style="color:#1d384a; text-decoration: none;">$1</a>'
  );

  // Convert [text](url) links to <a href="url">text</a>
  html = html.replace(
    /\[([^\]]*)\]\(([^)]*)\)/g,
    '<a href="$2" style="color:#1d384a; text-decoration: none;">$1</a>'
  );

  // Decode common HTML entities
  html = html.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  html = html.replace(/&#(\d+);/g, (match, dec) =>
    String.fromCharCode(parseInt(dec, 10))
  );
  html = html.replace(/&amp;/g, '&');
  html = html.replace(/&lt;/g, '<');
  html = html.replace(/&gt;/g, '>');
  html = html.replace(/&quot;/g, '"');

  // Clean up multiple consecutive <br> tags
  html = html.replace(/(<br>){3,}/g, '<br><br>');

  // Clean up <br> tags around block elements
  html = html.replace(/<br>(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\/h[1-6]>)<br>/g, '$1');
  html = html.replace(/<br>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<br>/g, '$1');
  html = html.replace(/<br>(<ol>)/g, '$1');
  html = html.replace(/(<\/ol>)<br>/g, '$1');
  html = html.replace(/(<li>.*?)<br>(<\/li>)/g, '$1$2');
  html = html.replace(/(<\/li>)<br>(<li>)/g, '$1$2');
  html = html.replace(/<br>(<img[^>]*>)/g, '$1');
  html = html.replace(/(<img[^>]*>)<br>/g, '$1');

  // Remove div containers that wrap iframes (including any attributes)
  html = html.replace(
    /<div[^>]*>[\s\S]*?<iframe[\s\S]*?<\/iframe>[\s\S]*?<\/div>/gi,
    ''
  );

  // Wrap everything in a container with max-width
  html = `<blockquote><div style="text-align: left; max-width: 500px; margin: 0 auto; padding-left: 10px; font-family: Arial, sans-serif; line-height: 1.6; color: #333; border-left: 2px solid #ccc;">${html}</div></blockquote>`;

  return html;
}
