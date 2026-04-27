import { createContext, useContext, ReactNode } from 'react'
import type { SharedProps } from '~/types/shared_props'

export interface PageData<T = {}> {
  props: SharedProps & T
  url: string
}

export const PageContext = createContext<PageData<any> | undefined>(undefined)

export function usePageContext<T = {}>(): PageData<T> {
  const context = useContext(PageContext)
  if (!context) {
    throw new Error('usePageContext must be used within a PageProvider')
  }
  return context as PageData<T>
}

export function PageProvider({ data, url, children }: { data: any; url: string; children: ReactNode }) {
  return <PageContext.Provider value={{ props: data, url }}>{children}</PageContext.Provider>
}
