import { contentUIDecorators, ContentLeafsProvider } from '@content-ui/react/ContentLeafsContext'
import { Validator } from '@ui-schema/json-schema'
import React from 'react'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { customTheme } from './theme.js'
import { Layout } from './components/Layout.js'
import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import CircularProgress from '@mui/material/CircularProgress'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { SnackProvider } from 'react-use-snack/SnackProvider'
import { browserT } from './t.js'
import { customBinding } from './components/UISchema.js'
import { useViewSettings } from './lib/ViewSettings.js'
import I18NextChainedBackend from 'i18next-chained-backend/dist/esm/i18nextChainedBackend.js'
import I18NextLocalStorageBackend from 'i18next-localstorage-backend'
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { contentUIMapping } from './components/ContentUI.js'
import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { requiredValidatorLegacy } from '@ui-schema/json-schema/Validators/RequiredValidatorLegacy'

const validator = Validator([
    ...standardValidators,
    requiredValidatorLegacy, // opinionated validator, HTML-like, empty-string = invalid
])

const validate = validator.validate

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

            <React.Suspense fallback={<CircularProgress/>}>
                <SnackProvider>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <UIMetaProvider
                            t={browserT}
                            binding={customBinding}
                            validate={validate}
                        >
                            <ContentLeafsProvider deco={contentUIDecorators} renderMap={contentUIMapping}>
                                <Layout/>
                            </ContentLeafsProvider>
                        </UIMetaProvider>
                    </LocalizationProvider>
                </SnackProvider>
            </React.Suspense>
        </ThemeProvider>
    </StyledEngineProvider>
}
