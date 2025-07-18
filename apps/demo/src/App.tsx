import { contentUIDecorators, ContentLeafsProvider } from '@content-ui/react/ContentLeafsContext'
import React from 'react'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { customTheme } from './theme.js'
import { Layout } from './components/Layout.js'
import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import resourcesToBackend from 'i18next-resources-to-backend'
import CircularProgress from '@mui/material/CircularProgress'
import { UIMetaProvider } from '@ui-schema/ui-schema/UIMeta'
import { SnackProvider } from 'react-use-snack/SnackProvider'
import { browserT } from './t.js'
import { getCustomWidgets } from './components/UISchema.js'
import { useViewSettings } from './lib/ViewSettings.js'
import I18NextChainedBackend from 'i18next-chained-backend/dist/esm/i18nextChainedBackend.js'
import I18NextLocalStorageBackend from 'i18next-localstorage-backend'
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'
import { UIApiProvider } from '@ui-schema/ui-schema/UIApi'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { contentUIMapping } from './components/ContentUI.js'

const themes = customTheme()

i18n
    .use(I18NextChainedBackend)
    .use(I18nextBrowserLanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        // todo: add AppConfig options for language setup
        supportedLngs: ['en'],
        fallbackLng: 'en',
        backend: {
            backendOptions: [
                {
                    versions: {
                        en: '0.0.1',
                    },
                },
            ],
            backends: [
                I18NextLocalStorageBackend,
                resourcesToBackend((language, namespace, callback) => {
                    import(`./locales/${language}/${namespace}.json`)
                        .then((resources) => {
                            callback(null, resources)
                        })
                        .catch((error) => {
                            console.error('Error loading translation for:', language, namespace, error)
                            callback(error, null)
                        })
                }),
            ],
        },
        interpolation: {
            escapeValue: false,
        },
        detection: {
            // order and from where user language should be detected
            order: ['localStorage', 'sessionStorage', 'navigator'/*, 'path', 'subdomain'*/],
            lookupLocalStorage: 'i18nLng',
            lookupSessionStorage: 'i18nLng',
            // lookupFromPathIndex: 0,
            // lookupFromSubdomainIndex: 0,

            // cache user language on
            caches: ['localStorage', 'sessionStorage'],
        },
    })

const customWidgets = getCustomWidgets()

const loadSchema = (url: string) => {
    return fetch(url).then(r => r.json())
}

export const App: React.ComponentType<{}> = () => {
    const {theme, lang} = useViewSettings()
    const {i18n} = useTranslation()

    const [t, sT] = React.useState(themes[theme])

    React.useEffect(() => {
        sT({...themes[theme]})
        window.localStorage.setItem('theme_mode', theme)
    }, [sT, theme])

    React.useEffect(() => {
        if(!lang) return
        i18n.changeLanguage(lang)
            .then(() => {
                // noop
            })
            .catch((e) => {
                console.log('i18n.changeLanguage failed', e)
            })
    }, [i18n, lang])

    return <StyledEngineProvider injectFirst>
        <ThemeProvider theme={t}>
            <CssBaseline/>

            <BrowserRouter>
                <React.Suspense fallback={<CircularProgress/>}>
                    <SnackProvider>
                        <UIApiProvider
                            loadSchema={loadSchema}
                            /* disables localStorage cache of e.g. loaded schemas */
                            noCache
                        >
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <UIMetaProvider t={browserT} widgets={customWidgets}>
                                    <ContentLeafsProvider deco={contentUIDecorators} renderMap={contentUIMapping}>
                                        <Layout/>
                                    </ContentLeafsProvider>
                                </UIMetaProvider>
                            </LocalizationProvider>
                        </UIApiProvider>
                    </SnackProvider>
                </React.Suspense>
            </BrowserRouter>
        </ThemeProvider>
    </StyledEngineProvider>
}
