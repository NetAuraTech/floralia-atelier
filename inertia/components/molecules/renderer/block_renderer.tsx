import { lazy, Suspense } from 'react'
import type { ResolvedBlock } from '#types/page'
import SectionBlock from '~/components/atoms/blocks/section_block'
import GridBlock from '~/components/atoms/blocks/grid_block'
import FlexBlock from "~/components/atoms/blocks/flex_block";

const TitleBlock = lazy(() => import('~/components/atoms/blocks/title_block'))
const ImageBlock = lazy(() => import('~/components/atoms/blocks/image_block'))
const ButtonBlock = lazy(() => import('~/components/atoms/blocks/button_block'))
const SeparatorBlock = lazy(() => import('~/components/atoms/blocks/separator_block'))
const ParagraphBlock = lazy(() => import('~/components/atoms/blocks/paragraph_block'))
const IconBlock = lazy(() => import('~/components/atoms/blocks/icon_block'))
const FormBlock = lazy(() => import('~/components/atoms/blocks/form_block'))
const FieldBlock = lazy(() => import('~/components/atoms/blocks/field_block'))
const HtmlTextBlock = lazy(() => import('~/components/atoms/blocks/html_text_block'))

interface BlockRendererProps {
  block: ResolvedBlock
  pageId: number
  locale: string
}

/**
 * Dispatches a single resolved block to the correct component.
 *
 * Container blocks (`section`, `grid`) receive their `children` rendered
 * recursively via this same component.
 */
export default function BlockRenderer({ block, pageId, locale }: BlockRendererProps) {
  const renderBlock = () => {
    switch (block.type) {
      case 'section':
        return (
          <SectionBlock block={block as ResolvedBlock<'section'>}>
            {block.children?.map((child) => (
              <BlockRenderer key={child.id} block={child} pageId={pageId} locale={locale} />
            ))}
          </SectionBlock>
        )
      case 'grid':
        return (
          <GridBlock block={block as ResolvedBlock<'grid'>}>
            {block.children?.map((child) => (
              <BlockRenderer key={child.id} block={child} pageId={pageId} locale={locale} />
            ))}
          </GridBlock>
        )
      case 'flex':
        return (<FlexBlock block={block as ResolvedBlock<'flex'>}>
          {block.children?.map((child) => (
            <BlockRenderer key={child.id} block={child} pageId={pageId} locale={locale} />
          ))}
        </FlexBlock>)
      case 'title':
        return <TitleBlock block={block as ResolvedBlock<'title'>} />
      case 'paragraph':
        return <ParagraphBlock block={block as ResolvedBlock<'paragraph'>} />
      case 'button':
        return <ButtonBlock block={block as ResolvedBlock<'button'>} />
      case 'separator':
        return <SeparatorBlock block={block as ResolvedBlock<'separator'>} />
      case 'icon':
        return <IconBlock block={block as ResolvedBlock<'icon'>} />
      case 'form':
        return <FormBlock block={block as ResolvedBlock<'form'>}>
          {block.children?.map((child) => (
            <BlockRenderer key={child.id} block={child} pageId={pageId} locale={locale} />
          ))}
        </FormBlock>
      case 'field':
        return <FieldBlock block={block as ResolvedBlock<'field'>} />
      case 'htmltext':
        return <HtmlTextBlock block={block as ResolvedBlock<'htmltext'>} />
      case 'image':
        return <ImageBlock block={block as ResolvedBlock<'image'>} />
      default:
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[BlockRenderer] Unknown block type: ${(block as any).type}`)
        }
        return null
    }
  }

  return (
    <Suspense fallback={<div className="animate-pulse bg-surface h-10 w-full rounded" />}>
      {renderBlock()}
    </Suspense>
  )
}
