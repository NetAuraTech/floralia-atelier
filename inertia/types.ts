import { type SharedProps } from '~/types/shared_props'
import { type PropsWithChildren } from 'react'
import { type JSONDataTypes } from '@adonisjs/core/types/transformers'

export type PageProps<T extends JSONDataTypes = {}> = PropsWithChildren<SharedProps & T>
