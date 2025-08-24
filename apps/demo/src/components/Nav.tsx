import { MuiNavLink } from '@content-ui/md-mui/MuiComponents/MuiNavLink'
import { config } from '../config.js'
import Box from '@mui/material/Box'

export const Nav = ({pb}: { pb: number }) => {
    return <Box style={{display: 'flex', alignItems: 'center', overflow: 'auto'}} pb={pb}>
        <MuiNavLink href={config.BASE_PATH + '/'} exact viewTransition>home</MuiNavLink>
        <span style={{margin: '0 4px', opacity: 0.65}}>{'|'}</span>
        <MuiNavLink href={config.BASE_PATH + '/complex'} viewTransition>complex</MuiNavLink>
        <span style={{margin: '0 4px', opacity: 0.65}}>{'|'}</span>
        <MuiNavLink href={config.BASE_PATH + '/input'} viewTransition>input</MuiNavLink>
        <span style={{margin: '0 4px', opacity: 0.65}}>{'|'}</span>
        <MuiNavLink href={config.BASE_PATH + '/form'} viewTransition>form</MuiNavLink>
    </Box>
}
