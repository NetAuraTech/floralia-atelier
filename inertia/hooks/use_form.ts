import { useState } from 'react'

const csrfToken = () =>
  (window as any)?.__PAGE__?.props?.csrfToken || ''

async function routerSubmit(
  method: string,
  url: string,
  data?: Record<string, any>,
  options?: {
    preserveScroll?: boolean
    onSuccess?: (res: Response) => void
    onError?: (errors: Record<string, string>) => void
    onFinish?: () => void
  }
) {
  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': csrfToken(),
      },
      body: data ? JSON.stringify(data) : undefined,
    })

    if (res.ok) {
      if (res.redirected && !options?.preserveScroll) {
        window.location.href = res.url
      } else if (options?.onSuccess) {
        options.onSuccess(res)
      } else {
        window.location.reload()
      }
    } else if (res.status === 422) {
      const json = await res.json()
      const errors: Record<string, string> = json.errors
        ? json.errors.reduce((acc: any, err: any) => {
          acc[err.field] = err.message
          return acc
        }, {})
        : {}
      options?.onError?.(errors)
    } else {
      if (res.redirected) {
        window.location.href = res.url
      } else {
        options?.onError?.({})
      }
    }
  } catch (e) {
    console.error(e)
    options?.onError?.({})
  } finally {
    options?.onFinish?.()
  }
}

export const router = {
  get:    (url: string) => { window.location.href = url },
  post:   (url: string, data?: Record<string, any>, options?: any) => routerSubmit('POST',   url, data, options),
  put:    (url: string, data?: Record<string, any>, options?: any) => routerSubmit('PUT',    url, data, options),
  delete: (url: string, data?: Record<string, any>, options?: any) => routerSubmit('DELETE', url, data, options),
  reload: () => { window.location.reload() },
  on:     () => () => {},
}

export function useForm<T extends Record<string, any>>(initialData: T | (() => T)) {
  const init = typeof initialData === 'function' ? (initialData as () => T)() : initialData
  const [data, setData] = useState<T>(init)
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const submit = async (method: string, url: string, options?: any) => {
    setProcessing(true)
    setErrors({})
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          // Note: we can't easily get the CSRF token here without context,
          // but if it's stored in a meta tag or window we could.
          'X-CSRF-Token': (window as any)?.__PAGE__?.props?.csrfToken || ''
        },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        if (res.redirected) {
          window.location.href = res.url
        } else if (options?.onSuccess) {
          options.onSuccess(res)
        } else {
          window.location.reload()
        }
      } else if (res.status === 422) {
        const json = await res.json()
        const newErrors = json.errors ? json.errors.reduce((acc: any, err: any) => {
           acc[err.field] = err.message
           return acc
        }, {}) : {}
        setErrors(newErrors)
        if (options?.onError) {
          options.onError(newErrors)
        }
      } else {
        if (res.redirected) {
          window.location.href = res.url
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setProcessing(false)
      if (options?.onFinish) {
        options.onFinish()
      }
    }
  }

  return {
    data,
    setData: (keyOrData: any, value?: any) => {
      if (typeof keyOrData === 'string') {
        setData(prev => ({ ...prev, [keyOrData]: value }))
      } else if (typeof keyOrData === 'function') {
        setData(keyOrData)
      } else {
        setData({ ...data, ...keyOrData })
      }
    },
    post: (url: string, options?: any) => submit('POST', url, options),
    put: (url: string, options?: any) => submit('PUT', url, options),
    delete: (url: string, options?: any) => submit('DELETE', url, options),
    processing,
    errors,
    clearErrors: () => setErrors({}),
    reset: () => setData(init),
    isDirty: false,
  }
}
