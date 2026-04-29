import { AnchorHTMLAttributes } from 'react'
import { urlFor } from '~/client'

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  route?: any
  routeParams?: any
  qs?: Record<string, any>
}

export function Link({ route, routeParams, qs, href, children, ...props }: LinkProps) {
  let resolvedHref = href ?? '#'
  if (route) {
    resolvedHref = urlFor(route as any, routeParams as any, { qs })
    resolvedHref += href ?? ''
  }

  return (
    <a href={resolvedHref} {...props}>
      {children}
    </a>
  )
}
