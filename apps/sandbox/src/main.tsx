import React, { useState } from 'react'
import {
    contentUIDecorators,
    ContentLeafsProvider,
} from '@content-ui/react/ContentLeafsContext'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { renderMapping } from '@content-ui/md-mui/LeafsMarkdown'
import { customTheme } from './theme'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { CustomCodeMirror } from './components/CustomCodeMirror'

const rootElement = document.getElementById('root')!
const root = ReactDOM.createRoot(rootElement)

const themes = customTheme()

const contentUIMapping: typeof renderMapping = {
    ...renderMapping,
    leafs: {
        ...renderMapping.leafs,
    },
    components: {
        ...renderMapping.components,
        Code: CustomCodeMirror,
    },
}

const Main = () => {
    const [theme, setTheme] = useState<'dark' | 'light'>(
        () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    )

    const toggleTheme = () => {
        setTheme(t => t === 'dark' ? 'light' : 'dark')
    }

    return <ThemeProvider theme={themes[theme]}>
        <CssBaseline/>
        <BrowserRouter>
            <ContentLeafsProvider
                deco={contentUIDecorators}
                renderMap={contentUIMapping}
            >
                <App toggleTheme={toggleTheme}/>
            </ContentLeafsProvider>
        </BrowserRouter>
    </ThemeProvider>
}

root.render(
    <React.StrictMode>
        <StyledEngineProvider injectFirst>
            <Main/>
        </StyledEngineProvider>
    </React.StrictMode>,
)
