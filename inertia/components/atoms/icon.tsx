import { useMemo } from 'react'
import { LucideProps } from 'lucide-react'
//@ts-ignore
import {DynamicIcon} from "lucide-react/dynamic.mjs";

/**
 * Converts PascalCase (Lucide default in JS) to kebab-case (required for dynamic imports).
 * Example: ArrowRight -> arrow-right, Trash2 -> trash-2
 */
const toKebabCase = (str: string) =>
  str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/^-/, '')

interface IconProps extends Omit<LucideProps, 'ref'> {
  /** Name of the Lucide icon to render. Can be PascalCase or kebab-case. */
  name: string
  /** Icon size in pixels. */
  size?: number
  /** Additional Tailwind classes. */
  className?: string
}

/**
 * Optimized wrapper around Lucide icons.
 *
 * Uses dynamic imports to load only the required icon SVG code.
 * This significantly reduces the bundle size by avoiding importing the entire library.
 */
export function Icon({ name, size, ...props }: IconProps) {
  const kebabName = useMemo(() => toKebabCase(name), [name])

  return (
    <DynamicIcon name={kebabName} size={size}   {...props}/>
  )
}
