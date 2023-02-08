import React from 'react'
import { Typography, TypographyOptions } from '@mui/material/styles/createTypography'

export type TypographyCode = {
    fontFamilyCode?: string
    fontSizeCode?: React.CSSProperties['fontSize']
}
export type TypographyOptionsWithExtras = TypographyOptions & TypographyCode
export type TypographyWithExtras = Typography & TypographyCode
