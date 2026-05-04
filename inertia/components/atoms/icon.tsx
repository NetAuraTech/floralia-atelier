//@ts-ignore
import { DynamicIcon } from 'lucide-react/dynamic.mjs'
import { LucideProps } from 'lucide-react'

interface IconProps extends LucideProps {
  /** Name of the Lucide icon to render. Supports PascalCase (e.g. ArrowLeft) or kebab-case (arrow-left). */
  name: string
  /** Icon size in pixels. Forwarded directly to the Lucide component. */
  size?: number
  /** Additional Tailwind classes (e.g. `text-danger`, `shrink-0`). */
  className?: string
}

/**
 * Converts PascalCase to kebab-case.
 * Lucide's dynamic imports use kebab-case keys.
 */
function toKebabCase(str: string) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * Thin wrapper around the Lucide DynamicIcon component.
 *
 * Each icon is loaded as a separate chunk only when needed.
 * Returns a placeholder while loading to prevent layout shifts.
 *
 * @example
 * <Icon name="ArrowLeft" size={18} />
 * <Icon name="trash" size={18} className="text-danger" />
 */
export function Icon(props: IconProps) {
  const { name, size, className, ...iconProps } = props

  // DynamicIcon expects kebab-case names
  const kebabName = toKebabCase(name)

  return (
    <DynamicIcon
      name={kebabName as any}
      size={size}
      className={className}
      fallback={() => <div style={{ width: size, height: size }} className={className} />}
      {...iconProps}
    />
  )
}
