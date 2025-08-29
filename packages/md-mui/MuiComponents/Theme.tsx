import type { CSSProperties } from 'react'
import type { TypographyVariants, TypographyVariantsOptions } from '@mui/material/styles'

export type TypographyCode = {
    fontFamilyCode?: string
    fontSizeCode?: CSSProperties['fontSize']
}
export type TypographyOptionsWithExtras = TypographyVariantsOptions & TypographyCode
export type TypographyWithExtras = TypographyVariants & TypographyCode
