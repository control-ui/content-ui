import React from 'react'
import Typography from '@mui/material/Typography'
import { ContentLeafProps } from '@content-ui/react/ContentLeaf'
import { WithMdAstChild } from '@content-ui/struct/Ast'

export const LeafImage: React.FC<ContentLeafProps & WithMdAstChild> = ({child}) =>
    child.type === 'image' ?
        <span
            style={{
                clear: 'right',
                float: 'right',
            }}
        >
            <img src={child.url} alt={child.alt || child.title || undefined}/>

            {child.title ?
                <Typography color={'textSecondary'} variant={'caption'} component={'span'}>{child.title}</Typography> : null}
        </span> : null
