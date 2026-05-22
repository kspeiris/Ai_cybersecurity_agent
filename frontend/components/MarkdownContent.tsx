import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownContentProps {
  content: string
  className?: string
  normalize?: boolean
}

function normalizeMarkdown(content: string) {
  return content
    .replace(/\s+(\d+\.\s+\*\*)/g, '\n\n$1')
    .replace(/([.!?])\s+(\*\*[^*\n]+:\*\*)/g, '$1\n\n$2')
    .trim()
}

export default function MarkdownContent({ content, className = '', normalize = false }: MarkdownContentProps) {
  const markdown = normalize ? normalizeMarkdown(content) : content

  return (
    <div
      className={`prose prose-sm prose-invert max-w-none text-slate-300 prose-headings:mb-2 prose-headings:mt-4 prose-headings:text-slate-100 prose-p:my-2 prose-p:leading-7 prose-strong:text-cyan-200 prose-a:text-accent prose-code:rounded prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-cyan-100 prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-slate-800 prose-pre:bg-slate-950 prose-ol:my-3 prose-ol:pl-5 prose-ul:my-3 prose-ul:pl-5 prose-li:my-1 prose-li:pl-1 ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  )
}
