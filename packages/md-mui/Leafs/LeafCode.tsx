import React from 'react'
import Box from '@mui/material/Box'
import { ContentLeafProps, ContentLeafsPropsMapping, useContentLeafs } from '@content-ui/react/ContentLeaf'
import { useLeafFollower } from '@content-ui/react/useLeafFollower'
import useTheme from '@mui/material/styles/useTheme'
import type { Theme } from '@mui/material/styles'
import { TypographyWithExtras } from '@content-ui/md-mui/MuiComponents/Theme'
import { MuiContentRenderComponents } from '../LeafsMarkdown'

export const LeafCode: React.FC<ContentLeafProps> = ({child, selected}) => {
    const code = child.type === 'code' ? child : undefined
    const cRef = useLeafFollower<HTMLDivElement>(selected)
    const {renderMap: {components}} = useContentLeafs<ContentLeafsPropsMapping, MuiContentRenderComponents>()
    if(child.type !== 'code') return null

    const Code = components.Code
        // eslint-disable-next-line deprecation/deprecation
        || components.CodeMirror

    return <Box mt={1} mb={2} ref={cRef}>
        {Code ?
            <Code
                value={child.value}
                lang={code?.lang || undefined}
            /> :
            <pre><code>{child.value}</code></pre>}
    </Box>
}

export const LeafCodeInline: React.FC<ContentLeafProps> = ({child}) => {
    const {typography} = useTheme<Theme & { typography: TypographyWithExtras }>()
    return <Box
        component={'code'}
        px={0.5}
        py={0.25}
        sx={{
            fontFamily: typography?.fontFamilyCode,
            fontSize: typography?.fontSizeCode,
            border: 0,
            backgroundColor: 'background.default',
            borderRadius: '4px',
            opacity: 0.8,
        }}
    >
        {child.type === 'inlineCode' ? child.value : null}
    </Box>
}
