import React from 'react'
import { TypographyVariants, TypographyVariantsOptions } from '@mui/material/styles'

export type TypographyCode = {
    fontFamilyCode?: string
    fontSizeCode?: React.CSSProperties['fontSize']
}
export type TypographyOptionsWithExtras = TypographyVariantsOptions & TypographyCode
export type TypographyWithExtras = TypographyVariants & TypographyCode
