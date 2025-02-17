import React from 'react'
import Box from '@mui/material/Box'
import { ContentLeafProps, ContentLeafsPropsMapping, useContentLeafs } from '@content-ui/react/ContentLeafsContext'
import { useLeafFollower } from '@content-ui/react/useLeafFollower'
import { useTheme } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import { TypographyWithExtras } from '@content-ui/md-mui/MuiComponents/Theme'
import type { MuiContentRenderComponents } from '@content-ui/md-mui/LeafsComponents'

export const LeafCode: React.FC<ContentLeafProps<'code'> & { dense?: boolean }> = ({child, selected, dense}) => {
    const cRef = useLeafFollower<HTMLDivElement>(selected)
    const {renderMap: {components}} = useContentLeafs<ContentLeafsPropsMapping, MuiContentRenderComponents>()

    const Code = components.Code
        // eslint-disable-next-line deprecation/deprecation
        || components.CodeMirror

    return <Box mt={1} mb={2} ref={cRef}>
        {Code ?
            <Code
                value={child.value}
                lang={child?.lang || undefined}
                dense={dense}
            /> :
            <pre><code>{child.value}</code></pre>}
    </Box>
}

export const LeafCodeInline: React.FC<ContentLeafProps<'inlineCode'>> = ({child}) => {
    const {typography} = useTheme<Theme & { typography: TypographyWithExtras }>()
    return <Box
        component={'code'}
        px={0.5}
        py={0.25}
        sx={{
            fontFamily: typography?.fontFamilyCode,
            // todo: this may not be consistent with `dense`, inheriting directly from settings or using `em` may be safer
            fontSize: typography?.fontSizeCode,
            border: 0,
            backgroundColor: 'background.default',
            borderRadius: '4px',
            opacity: 0.8,
        }}
    >
        {child.value}
    </Box>
}
