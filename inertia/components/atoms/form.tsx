import {FormHTMLAttributes, useState, ReactNode, FormEvent} from 'react'
import { urlFor } from '~/client'
import { usePageContext } from '~/context/page_context'

interface FormRenderProps {
  errors: Record<string, string>
  processing: boolean
  reset: (id: string) => void
}

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'children'> {
  route?: any
  routeParams?: any
  qs?: Record<string, any>
  children: ((props: FormRenderProps) => ReactNode) | ReactNode
  onBefore?: (options: { data: Record<string, any> }) => boolean | void
  onSuccess?: (response: Response) => void | Promise<void>
  onError?: (errors: Record<string, string>) => void
  ajax?: boolean
}

export function Form({
  route,
  routeParams,
  qs,
  action,
  method = 'POST',
  children,
  onBefore,
  onSuccess,
  onError,
  onSubmit,
  ajax = false,
  ...props
}: FormProps) {
  const { props: pageProps } = usePageContext()

  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const resolvedAction = route ? urlFor(route as any, routeParams as any, { qs }) : (action ?? '')

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (onSubmit) onSubmit(e)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    if (onBefore) {
      const shouldContinue = onBefore({ data })
      if (shouldContinue === false) return
    }

    setProcessing(true)
    try {
      if (ajax) {
        // TODO
      } else {
        e.currentTarget.submit()
      }
    } finally {
      setProcessing(false)
    }
  }

  const reset = (id: string) => {
    // TODO
  }

  return (
    <form action={resolvedAction} method={method} onSubmit={handleSubmit} {...props}>
      {!ajax && <input type="hidden" name="_csrf" value={pageProps.csrfToken} />}
      {typeof children === 'function' ? children({ errors, processing, reset }) : children}
    </form>
  )
}
