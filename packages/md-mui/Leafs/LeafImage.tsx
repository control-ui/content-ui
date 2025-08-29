import type { FC } from 'react'
import Typography from '@mui/material/Typography'
import { ContentLeafProps } from '@content-ui/react/ContentLeafsContext'

export const LeafImage: FC<ContentLeafProps<'image'>> = ({child}) =>
    <span
        style={{
            display: 'inline-flex',
            flexDirection: 'column',
        }}
    >
        <img
            src={child.url}
            alt={child.alt || child.title || undefined}
            style={{
                objectFit: 'contain',
                maxWidth: '100%',
                fontSize: 8,
                lineHeight: 10,
            }}
        />

        {child.title ?
            <Typography color={'textSecondary'} variant={'caption'} component={'span'} sx={{my: 0.75, mx: 0.5}} lineHeight={1.46}>{child.title}</Typography> : null}
    </span>
