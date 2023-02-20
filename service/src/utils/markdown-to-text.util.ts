import removeMarkdown from 'markdown-to-text';

export function convertMarkdownToText(markdown: string): string {
  return removeMarkdown(markdown);
}
