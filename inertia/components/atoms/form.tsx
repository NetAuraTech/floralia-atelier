import { FormHTMLAttributes, useState, ReactNode } from 'react'
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
  ...props
}: FormProps) {
  const { props: pageProps } = usePageContext()

  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const resolvedAction = route ? urlFor(route as any, routeParams as any, { qs }) : (action ?? '')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (onSubmit) onSubmit(e)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    if (onBefore) {
      const shouldContinue = onBefore({ data })
      if (shouldContinue === false) return
    }

    setProcessing(true)
    setErrors({})

    try {
      const isGet = method.toUpperCase() === 'GET'
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-Token': pageProps.csrfToken || '',
        },
      }

      let fetchUrl = resolvedAction
      if (!isGet) {
        fetchOptions.body = formData
      } else {
        const urlObj = new URL(resolvedAction, window.location.origin)
        formData.forEach((value, key) => {
          urlObj.searchParams.append(key, value.toString())
        })
        fetchUrl = urlObj.toString()
      }

      const res = await fetch(fetchUrl, fetchOptions)

      if (res.ok) {
        if (res.redirected) {
          window.location.href = res.url
        } else if (onSuccess) {
          await onSuccess(res)
        } else {
          window.location.reload()
        }
      } else if (res.status === 422) {
        const result = await res.json()
        const newErrors = result.errors ? result.errors.reduce((acc: any, err: any) => {
           acc[err.field] = err.message
           return acc
        }, {}) : {}
        setErrors(newErrors)
        if (onError) onError(newErrors)
      } else {
        console.error('Form submission failed', res)
        if (res.redirected) {
          window.location.href = res.url
        } else if (res.status === 400 || res.status === 403 || res.status === 500) {
            const text = await res.text()
            console.error(text)
        }
      }
    } catch (err) {
      console.error('Form network error', err)
    } finally {
      setProcessing(false)
    }
  }

  const reset = (id: string) => {
    // TODO
  }

  return (
    <form action={resolvedAction} method={method} onSubmit={handleSubmit} {...props}>
      {typeof children === 'function' ? children({ errors, processing, reset }) : children}
    </form>
  )
}
