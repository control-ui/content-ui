import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import { PageHome } from '../pages/PageHome'
import { config } from '../config'
import { SnackRenderer, useSnack } from 'react-use-snack'
import { Nav } from './Nav'
import { MuiLink } from './Links/MuiLink'
import { useViewSettings, useViewSettingsToggle } from '../lib/ViewSettings'
import IconButton from '@mui/material/IconButton'
import IcInvert from '@mui/icons-material/InvertColors'
import IcTranslate from '@mui/icons-material/Translate'
import ListItemIcon from '@mui/material/ListItemIcon'
import Popover from '@mui/material/Popover'
import MuiList from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { useProgressControlReset } from 'react-progress-state'
import Tooltip from '@mui/material/Tooltip'
import { PageComplex } from '../pages/PageComplex'
import { PageInput } from '../pages/PageInput'
import { PageForm } from '../pages/PageForm'

export const Header: React.FC<{ version?: string }> = ({version}) => {
    const {theme, lang} = useViewSettings()
    const {i18n, t} = useTranslation()
    const {toggleField, setField} = useViewSettingsToggle()
    const [showLang, setShowLang] = React.useState<HTMLButtonElement | null>(null)

    return <div style={{padding: '4px 12px 4px 12px', display: 'flex', alignItems: 'center', overflow: 'auto', flexShrink: 0}}>
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
    </div>
}

const basePath = config.BASE_PATH
export const Layout: React.ComponentType<{}> = () => {
    const {snackbars, rmNotice} = useSnack()
    const scrollWrapper = React.useRef<HTMLDivElement | null>(null)
    const {resetScopes} = useProgressControlReset()

    React.useLayoutEffect(() => {
        return () => resetScopes([])
    }, [resetScopes])

    return <>
        <Header/>

        <div
            ref={scrollWrapper}
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                width: '100%',
                position: 'relative',
                overflow: 'auto',
            }}
        >
            <Routes>
                <Route path={basePath + '/'} element={<PageHome/>}/>
                <Route path={basePath + '/complex'} element={<PageComplex/>}/>
                <Route path={basePath + '/input'} element={<PageInput/>}/>
                <Route path={basePath + '/form'} element={<PageForm/>}/>
            </Routes>
        </div>

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
