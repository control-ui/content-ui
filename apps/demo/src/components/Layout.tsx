import { MuiLink } from '@content-ui/md-mui/MuiComponents/MuiLink'
import LinearProgress from '@mui/material/LinearProgress'
import { lazy, Suspense, useRef, useState } from 'react'
import { createBrowserRouter, RouterProvider, Outlet, useViewTransitionState } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import { config } from '../config.js'
import { SnackRenderer, useSnack } from 'react-use-snack'
import { Nav } from './Nav.js'
import { useViewSettings, useViewSettingsToggle } from '../lib/ViewSettings.js'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import IcInvert from '@mui/icons-material/InvertColors'
import IcTranslate from '@mui/icons-material/Translate'
import ListItemIcon from '@mui/material/ListItemIcon'
import Popover from '@mui/material/Popover'
import MuiList from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'

export const Header = ({version}: { version?: string }) => {
    const {theme, lang} = useViewSettings()
    const {i18n, t} = useTranslation()
    const {toggleField, setField} = useViewSettingsToggle()
    const [showLang, setShowLang] = useState<HTMLButtonElement | null>(null)
    // note: using react-router v7, which isn't cross-platform, on FF this won't work, as not supported
    //       leading to no visual indicators when switching routes;
    //       use v6 for normal Suspense support!
    //       https://github.com/remix-run/react-router/issues/12474
    const viewPending = useViewTransitionState('*')

    return <Box
        sx={{
            position: 'relative',
        }}
    >
        {viewPending ?
            <LinearProgress
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                }}
            /> : null}

        <Box
            sx={{
                padding: '4px 12px 4px 12px',
                display: 'flex',
                alignItems: 'center', overflow: 'auto', flexShrink: 0,
            }}
        >

            <div style={{display: 'flex', alignItems: 'center', flexGrow: 1, overflow: 'auto'}}>
                <Tooltip title={'version: ' + config.VERSION}>
                    <MuiLink href={config.BASE_PATH + '/'} style={{display: 'flex'}} title={version}>
                        <img src={config.BASE_PATH + '/logo.svg'} style={{height: 38}}/>
                    </MuiLink>
                </Tooltip>
                <Box style={{display: 'flex', flexDirection: 'column', flexGrow: 1, marginLeft: 12, overflow: 'auto'}} mt={0.5} mb={0}>
                    <MuiLink
                        href={config.BASE_PATH + '/'} underline={'none'} color={'textPrimary'} style={{marginRight: 'auto'}}
                    >
                        <Typography variant={'subtitle2'} sx={{lineHeight: 1.25}}>
                            Content-UI
                        </Typography>
                    </MuiLink>

                    <Nav pb={0.5}/>
                </Box>
            </div>

            <IconButton onClick={(e) => setShowLang(s => s ? null : e.target as HTMLButtonElement)}>
                <IcTranslate style={{pointerEvents: 'none'}}/>
            </IconButton>
            <Popover
                open={Boolean(showLang)} onClose={() => setShowLang(null)}
                anchorEl={showLang}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MuiList disablePadding>
                    <ListItemButton
                        disabled
                        onClick={() => {
                            setField('lang', 'de')
                            setShowLang(null)
                        }}
                        selected={lang === 'de' || i18n.language === 'de'}
                    >
                        <ListItemIcon>
                            <span>🇩🇪</span>
                        </ListItemIcon>
                        <ListItemText primary={t('locales.de')}/>
                    </ListItemButton>
                    <ListItemButton
                        onClick={() => {
                            setField('lang', 'en')
                            setShowLang(null)
                        }}
                        selected={lang === 'en' || i18n.language === 'en'}
                    >
                        <ListItemIcon>
                            <span>🇺🇸</span>
                        </ListItemIcon>
                        <ListItemText primary={t('locales.en')}/>
                    </ListItemButton>
                </MuiList>
            </Popover>

            <IconButton
                onClick={() => toggleField('theme', 'dark', 'light')}
                title={theme === 'dark' ? 'switch to light mode' : 'switch to dark mode'}
            >
                <IcInvert/>
            </IconButton>
        </Box>
    </Box>
}

const basePath = config.BASE_PATH

const LayoutContent = () => {
    const {snackbars, rmNotice} = useSnack()
    const scrollWrapper = useRef<HTMLDivElement | null>(null)

    return <>
        <Header/>

        <Box
            ref={scrollWrapper}
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                position: 'relative',
                overflow: 'auto',
            }}
        >
            <Suspense fallback={<CircularProgress sx={{mx: 'auto', my: 2}}/>}>
                <Outlet/>
            </Suspense>
        </Box>

        <div style={{margin: 'auto auto 6px auto', paddingTop: 3}}>
            <Typography variant={'caption'}>
                <MuiLink
                    underline={'none'} color={'primary'}
                    href={'https://github.com/control-ui/content-ui'}
                    target={'_blank'} rel="noreferrer noopener"
                >Content-UI</MuiLink>
                <span>{' by '}</span>
                <MuiLink
                    underline={'none'} color={'secondary'}
                    href={'https://bemit.codes'}
                    target={'_blank'} rel="noreferrer noopener"
                >bemit.codes</MuiLink>
            </Typography>
        </div>

        {snackbars?.map(sb =>
            <SnackRenderer
                key={sb.id}
                snack={sb}
                rmNotice={rmNotice}
            />,
        )}
    </>
}

const routesForRouter = [
    {
        path: basePath.endsWith('/') ? basePath + '*' : basePath + '*',
        element: <LayoutContent/>,
        children: [
            {
                index: true,
                Component: lazy(() => import('../pages/PageHome.js').then(m => ({default: m.PageHome}))),
            },
            {
                path: 'complex',
                Component: lazy(() => import('../pages/PageComplex.js').then(m => ({default: m.PageComplex}))),
            },
            {
                path: 'input',
                Component: lazy(() => import('../pages/PageInput.js').then(m => ({default: m.PageInput}))),
            },
            {
                path: 'form',
                Component: lazy(() => import('../pages/PageForm.js').then(m => ({default: m.PageForm}))),
            },
        ],
    },
]

const router = createBrowserRouter(routesForRouter, {
    future: {},
})

export const Layout = () => {
    return <RouterProvider
        router={router}
    />
}
