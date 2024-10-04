/**
 * @jest-environment jsdom
 */
import { ContentLeafsProvider, contentUIDecorators } from '@content-ui/react/ContentLeafsContext'
import { it, expect, describe } from '@jest/globals'
import '@testing-library/jest-dom/jest-globals'
import { render, screen } from '@testing-library/react'
import i18n from 'i18next'
import I18NextChainedBackend from 'i18next-chained-backend'
import resourcesToBackend from 'i18next-resources-to-backend'
import { Suspense } from 'react'
import { initReactI18next } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { contentUIMapping } from '../src/components/ContentUI'
import { PageHome } from '../src/pages/PageHome'

// rm -rf node_modules/.cache && npm run test -- --testPathPattern=PageHome --no-cache

// todo: demo-app tests have some issues with `CodeMirror` being imported in different ways
//       Error: Uncaught [Error: Unrecognized extension value in extension set ([object Object]). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.]
//       - maybe as `kit-codemirror`/`material-code` and `md-mui` is not yet strict ESM, but this project is
//       - webpack has no issue with it, but webpack follows the `main/module` package.json settings, while ts-jest only follows `type: "module"` for ESM resolving

describe('PageHome', () => {
    i18n
        .use(I18NextChainedBackend)
        .use(initReactI18next) // passes i18n down to react-i18next
        .init({
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
                    resourcesToBackend((language, namespace, callback) => {
                        import(`../src/locales/${language}/${namespace}.json`)
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
            detection: {},
        })

    it('PageHome Content', async() => {
        render(
            <BrowserRouter>
                <ContentLeafsProvider deco={contentUIDecorators} renderMap={contentUIMapping}>
                    <Suspense>
                        <PageHome/>
                    </Suspense>
                </ContentLeafsProvider>
            </BrowserRouter>,
        )
        expect(await screen.findByText('Content-UI Demo')).toBeInTheDocument()
    })
})
