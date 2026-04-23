import type { ResolvedBlock } from '#types/page'

const fitMap: Record<string, string> = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
}

interface ImageBlockProps {
  block: ResolvedBlock<'image'>
}

/**
 * Renders a single resolved image with optional caption.
 * When `fullWidth` is true the image stretches to fill its container;
 * otherwise it uses `width: auto` with a max-width constraint.
 */
export default function ImageBlock({ block }: ImageBlockProps) {
  const { file, className } = block.props

  if (!file) return null

  return (
    <img src={file.url} alt={file.alt} className={[className].filter(Boolean).join(' ')} />
  )
}
