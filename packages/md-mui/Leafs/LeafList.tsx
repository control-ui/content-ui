import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IcChecked from '@mui/icons-material/CheckBox'
import IcUnchecked from '@mui/icons-material/CheckBoxOutlineBlank'
import { LeafChildNodes } from '@content-ui/md-mui/LeafChildNodes'
import { ContentLeafProps } from '@content-ui/react/ContentLeafsContext'

export const LeafList: React.FC<ContentLeafProps<'list'>> = ({child}) => {
    const component = child.ordered ? 'ol' : 'ul'
    const dense = 'dense' in child && child.dense
    const inList = 'inList' in child && child.inList
    return <Box
        component={component}
        sx={{
            ml: 0.5,
            mt: dense || inList ? 0.5 : 1.5,
            mb: dense || inList ? 0.5 : 2,
            pl: inList ? 1.5 : 3,
        }}
        style={{outline: 0, border: 0}}
    >
        <LeafChildNodes childNodes={child.children}/>
    </Box>
}

export const LeafListItem: React.FC<ContentLeafProps<'listItem'>> = ({child}) => {
    const listItemContent = <LeafChildNodes childNodes={child.children.filter(c => c.type !== 'list')}/>
    return <Typography
        component={'li'} variant={'body1'}
        sx={{
            px: 0.5,
            listStyleType: typeof child.checked === 'boolean' ? 'none' : undefined,
        }}
    >
        {typeof child.checked === 'boolean' ?
            <Box style={{display: 'flex', alignItems: 'center'}} ml={-3.5}>
                {child.checked ?
                    <IcChecked color={'info'} fontSize={'small'}/> :
                    <IcUnchecked fontSize={'small'}/>}
                <Box style={{flexGrow: 1}} ml={1}>
                    {listItemContent}
                </Box>
            </Box> :
            listItemContent}

        <LeafChildNodes
            childNodes={
                child.children
                    .filter(c => c.type === 'list')
                    .map(c => ({
                        ...c,
                        inList: true,
                    }))
            }
        />
    </Typography>
}
