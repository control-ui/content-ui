import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { ViewSettingsProvider } from './lib/ViewSettings'

createRoot(document.querySelector('#root') as Element)
    .render(
        <React.StrictMode>
            <React.Profiler id="Content-UI" onRender={() => null}>
                <ViewSettingsProvider
                    initialTheme={
                        (window.localStorage.getItem('theme_mode') as 'dark' | 'light') ||
                        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                    }
                >
                    <App/>
                </ViewSettingsProvider>
            </React.Profiler>
        </React.StrictMode>,
    )
