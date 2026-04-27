let dompurify: any = null

async function getPurifier() {
  if (!dompurify) {
    const { default: DOMPurify } = await import('dompurify')
    dompurify = DOMPurify
  }
  return dompurify
}

const PURIFY_CONFIG = {
  USE_PROFILES: { html: true },
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 's', 'del', 'ins',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
    'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'figure', 'figcaption', 'hr', 'span', 'div',
  ],
  ALLOWED_ATTR: [
    'href', 'src', 'alt', 'title', 'target', 'rel',
    'class', 'id', 'width', 'height', 'colspan', 'rowspan', 'data-*'
  ],
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onsubmit'],
  FORCE_BODY: true,
}

export interface SanitizationOptions {
  htmlMode?: 'strip' | 'clean' | false
  trim?: boolean
  lowercase?: boolean
  removeMultipleSpaces?: boolean
}

const DEFAULT_OPTIONS: SanitizationOptions = {
  htmlMode: 'strip',
  trim: true,
  lowercase: false,
  removeMultipleSpaces: true,
}

async function handleHtmlSanitization(value: string, mode: 'strip' | 'clean'): Promise<string> {
  const purifier = await getPurifier()
  if (mode === 'strip') {
    return purifier.sanitize(value, { ALLOWED_TAGS: [] })
  }

  return purifier.sanitize(value, PURIFY_CONFIG)
}

function collapseSpaces(value: string): string {
  return value.replace(/\s+/g, ' ')
}

export async function sanitize(value: string, options: SanitizationOptions = {}): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  let sanitized = value

  if (opts.htmlMode) {
    sanitized = await handleHtmlSanitization(sanitized, opts.htmlMode)
  }

  if (opts.trim) {
    sanitized = sanitized.trim()
  }

  if (opts.lowercase) {
    sanitized = sanitized.toLowerCase()
  }

  if (opts.removeMultipleSpaces) {
    sanitized = collapseSpaces(sanitized)
  }

  return sanitized
}

export async function sanitizeRichText(value: string): Promise<string> {
  return sanitize(value, {
    htmlMode: 'clean',
    trim: true,
    removeMultipleSpaces: false,
  })
}

export async function sanitizeText(value: string): Promise<string> {
  return sanitize(value, {
    htmlMode: 'strip',
    trim: true,
    removeMultipleSpaces: true,
  })
}

export async function sanitizeEmail(value: string): Promise<string> {
  return sanitize(value, {
    htmlMode: 'strip',
    trim: true,
    lowercase: true,
    removeMultipleSpaces: true,
  })
}

export async function noSanitization(value: string): Promise<string> {
  return value
}

export function getSanitizer(type: string, shouldSanitize: boolean) {
  if (!shouldSanitize) return noSanitization

  switch (type) {
    case 'email':
      return sanitizeEmail
    case 'password':
      return noSanitization
    case 'richtext':
    case 'textarea':
      return sanitizeRichText
    default:
      return sanitizeText
  }
}
