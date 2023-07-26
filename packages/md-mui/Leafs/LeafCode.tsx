import React from 'react'
import Box from '@mui/material/Box'
import { ContentLeafProps, useContentLeafs } from '@content-ui/react/ContentLeaf'
import { useLeafFollower } from '@content-ui/react/useLeafFollower'
import { Theme, useTheme } from '@mui/material/styles'
import { TypographyWithExtras } from '@content-ui/md-mui/MuiComponents/Theme'

export const LeafCode: React.FC<ContentLeafProps> = ({child, selected}) => {
    const code = child.type === 'code' ? child : undefined
    const cRef = useLeafFollower<HTMLDivElement>(selected)
    const {render: {components}} = useContentLeafs()

    return <Box mt={1} mb={2} ref={cRef}>
        <components.CodeMirror
            value={child.type === 'code' ? child.value : ''}
            lang={code?.lang || undefined}
        />
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
