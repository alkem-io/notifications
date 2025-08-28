import { convertMarkdownToHtml } from '../../src/services/notification/utils/markdown-to-html.util';

describe('Markdown to HTML Converter', () => {
  it('should convert basic markdown to HTML', () => {
    const markdown = '**Bold text** and *italic text*';
    const result = convertMarkdownToHtml(markdown);
    expect(result).toContain('<strong>Bold text</strong> and <em>italic text</em>');
    expect(result).toContain('max-width: 500px'); // Check for container
  });

  it('should convert images to HTML', () => {
    const markdown = 'Check out ![My Image](https://example.com/image.jpg)';
    const result = convertMarkdownToHtml(markdown);
    expect(result).toContain('<img src="https://example.com/image.jpg" alt="My Image"');
    expect(result).toContain('display: block');
    expect(result).toContain('max-width: 100%');
  });

  it('should handle images and links together', () => {
    const markdown = '![Screenshot](https://example.com/screen.png) and [link](https://example.com)';
    const result = convertMarkdownToHtml(markdown);
    expect(result).toContain('<img src="https://example.com/screen.png"');
    expect(result).toContain('alt="Screenshot"');
    expect(result).toContain('<a href="https://example.com"');
  });

  it('should convert links to HTML', () => {
    const markdown = 'Check out [this link](https://example.com)';
    const result = convertMarkdownToHtml(markdown);
    expect(result).toContain('Check out <a href="https://example.com" style="color:#1d384a; text-decoration: none;">this link</a>');
  });

  it('should convert code blocks', () => {
    const markdown = 'Use `console.log()` for debugging';
    const result = convertMarkdownToHtml(markdown);
    expect(result).toContain('Use <code style="background-color: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 90%;">console.log()</code> for debugging');
  });

  it('should convert line breaks', () => {
    const markdown = 'Line 1\nLine 2';
    const result = convertMarkdownToHtml(markdown);
    expect(result).toContain('Line 1<br>Line 2');
  });

  it('should handle headings', () => {
    const markdown = '# Heading 1\n## Heading 2';
    const result = convertMarkdownToHtml(markdown);
    expect(result).toContain('<h1 style="margin: 28px 0 16px 0; font-size: 26px; font-weight: bold; color: #1d384a;">Heading 1</h1>');
    expect(result).toContain('<h2 style="margin: 24px 0 12px 0; font-size: 22px; font-weight: bold; color: #1d384a;">Heading 2</h2>');
  });

  it('should handle bullet points', () => {
    const markdown = '- Item 1\n- Item 2';
    const result = convertMarkdownToHtml(markdown);
    expect(result).toContain('<ul style="margin: 16px 0; padding-left: 20px; list-style-type: disc;">');
    expect(result).toContain('<li>Item 1</li><li>Item 2</li>');
  });

  it('should handle numbered lists', () => {
    const markdown = '1. First item\n2. Second item';
    const result = convertMarkdownToHtml(markdown);
    expect(result).toContain('<ol style="margin: 16px 0; padding-left: 20px; list-style-type: decimal;">');
    expect(result).toContain('<li>First item</li><li>Second item</li>');
  });

  it('should handle plain URL links', () => {
    const markdown = 'Visit <https://example.com> for more info';
    const result = convertMarkdownToHtml(markdown);
    expect(result).toContain('Visit <a href="https://example.com" style="color:#1d384a; text-decoration: none;">https://example.com</a> for more info');
  });

  it('should decode HTML entities', () => {
    const markdown = 'an&#x64; test &#x20; here';
    const result = convertMarkdownToHtml(markdown);
    expect(result).toContain('and test   here');
  });

  it('should handle empty or null input', () => {
    expect(convertMarkdownToHtml('')).toBe('');
    expect(convertMarkdownToHtml(null as any)).toBe('');
    expect(convertMarkdownToHtml(undefined as any)).toBe('');
  });

  it('should handle complex markdown', () => {
    const markdown = '# Important Update\n\nHello **team**!\n\nPlease check [our docs](https://docs.example.com) for:\n\n1. New features\n2. Bug fixes\n\nAlso visit <https://github.com/example>\n\nHere is a screenshot: ![UI Screenshot](https://example.com/ui.png)\n\nUse `npm install` to update.';
    const result = convertMarkdownToHtml(markdown);

    expect(result).toContain('<h1 style="margin: 28px 0 16px 0; font-size: 26px; font-weight: bold; color: #1d384a;">Important Update</h1>');
    expect(result).toContain('<strong>team</strong>');
    expect(result).toContain('<a href="https://docs.example.com"');
    expect(result).toContain('<ol style="margin: 16px 0; padding-left: 20px; list-style-type: decimal;">');
    expect(result).toContain('<a href="https://github.com/example"');
    expect(result).toContain('<img src="https://example.com/ui.png"');
    expect(result).toContain('alt="UI Screenshot"');
    expect(result).toContain('<code style="background-color: #f4f4f4');
  });
});
