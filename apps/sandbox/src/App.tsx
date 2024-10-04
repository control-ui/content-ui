import IconButton from '@mui/material/IconButton'
import { Route, Routes } from 'react-router'
import { PageHome } from './pages/PageHome'
import { MuiNavLink } from '@content-ui/md-mui/MuiComponents/MuiNavLink'
import { PageInput } from './pages/PageInput'
import IcGitHub from '@mui/icons-material/GitHub'
import IcInvert from '@mui/icons-material/InvertColors'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

export default function App({toggleTheme}: { toggleTheme: () => void }) {
    return (
        <Box
            style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
                maxHeight: '100%',
            }}
        >
            <Box px={2} py={1} style={{display: 'flex', alignItems: 'center', textAlign: 'left'}}>
                <MuiNavLink href={'/'} exact>
                    home
                </MuiNavLink>
                <Divider orientation={'vertical'} sx={{mx: 0.5, height: '1.25rem'}}/>
                <MuiNavLink href={'/input'}>input</MuiNavLink>
                <IconButton
                    size={'small'}
                    onClick={() => toggleTheme()}
                    sx={{display: 'flex', ml: 'auto'}}
                >
                    <IcInvert fontSize={'small'}/>
                </IconButton>
                <MuiNavLink
                    href={'https://github.com/control-ui/content-ui'}
                    target={'_blank'}
                    rel="noreferrer noopener"
                    sx={{display: 'flex', ml: 1}}
                >
                    <IcGitHub fontSize={'small'}/>
                </MuiNavLink>
            </Box>
            <Box
                style={{display: 'flex', flexDirection: 'column', overflow: 'auto'}}
            >
                <Routes>
                    <Route path={''} element={<PageHome/>}/>
                    <Route path={'input'} element={<PageInput/>}/>
                </Routes>
            </Box>
        </Box>
    )
}
