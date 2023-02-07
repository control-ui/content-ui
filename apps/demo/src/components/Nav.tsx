import React from 'react'
import { config } from '../config'
import { MuiNavLink } from './Links/MuiNavLink'
import Box from '@mui/material/Box'

export const Nav: React.FC<React.PropsWithChildren<{ pb: number }>> = ({children, pb}) => {
    return <Box style={{display: 'flex', alignItems: 'center', overflow: 'auto'}} pb={pb}>
        <div style={{margin: '0 4px 0 0', textAlign: 'left'}}>
            <MuiNavLink href={config.BASE_PATH + '/'} exact>home</MuiNavLink>
            <span style={{margin: '0 4px', opacity: 0.65}}>{'|'}</span>
            <MuiNavLink href={config.BASE_PATH + '/complex'}>complex</MuiNavLink>
            <span style={{margin: '0 4px', opacity: 0.65}}>{'|'}</span>
            <MuiNavLink href={config.BASE_PATH + '/input'}>input</MuiNavLink>
            <span style={{margin: '0 4px', opacity: 0.65}}>{'|'}</span>
            <MuiNavLink href={config.BASE_PATH + '/form'}>form</MuiNavLink>
        </div>
        {children || null}
    </Box>
}
