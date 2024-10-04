import React from 'react'
import Typography from '@mui/material/Typography'
import { ContentLeafProps } from '@content-ui/react/ContentLeafsContext'

export const LeafImage: React.FC<ContentLeafProps<'image'>> = ({child}) =>
    <span
        style={{
            clear: 'right',
            float: 'right',
        }}
    >
        <img src={child.url} alt={child.alt || child.title || undefined}/>

        {child.title ?
            <Typography color={'textSecondary'} variant={'caption'} component={'span'}>{child.title}</Typography> : null}
    </span>
