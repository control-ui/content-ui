import Paper from '@mui/material/Paper'
import React from 'react'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { UIMetaProvider } from '@ui-schema/ui-schema/UIMeta'
import { createOrderedMap, createStore, injectPluginStack, JsonSchema, onChangeHandler, storeUpdater, UIStoreProvider, UIStoreType, useUIMeta } from '@ui-schema/ui-schema'
import { UIMetaReadContextType } from '@ui-schema/ui-schema/UIMetaReadContext'
import { readWidgets } from '../components/UISchema'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'
import { OrderedMap } from 'immutable'

const mdIntro = `UI-Schema based form with **read-or-write mode** and Markdown editor.

*CodeMirror* input field with highlighting and **preview mode**.
`

const md = `# Content-UI Demo

Lorem ipsum dolor sit amet.

Hey there this is some content, rendered from Markdown as ReactJS components using MUI.

## Features

> Blockqoute on the go.

Lorem ipsum __breaking **line**__.

- item 1
- item 2
- item 3

## Code Blocks

Highlighting on both sides - in editor and read mode.

\`\`\`js
const demo = ''
const result = demo.slice(0, 1)
\`\`\`

But not in inline code: \`var some = true\`.
`

const schema = createOrderedMap<JsonSchema>({
    type: 'object',
    properties: {
        name: {
            type: 'string',
        },
        intro: {
            type: 'string',
            widget: 'Markdown',
        },
        content: {
            type: 'string',
            widget: 'Markdown',
        },
    },
})

const GridStack = injectPluginStack(GridContainer)

const showValidityOnRead = false
const showValidity = false

let i = 0

export const PageForm: React.ComponentType = () => {
    const {t} = useTranslation('translation')
    const [edit, setEdit] = React.useState(false)
    const {widgets, t: tUI} = useUIMeta()
    const [readDense, setReadDense] = React.useState(false)
    const [store, setStore] = React.useState<UIStoreType>(() => createStore(OrderedMap({})))

    const onChange: onChangeHandler = React.useCallback((actions) => {
        setStore(storeUpdater(actions))
    }, [setStore])

    const rtdWidgets = React.useMemo(() => ({
        ...widgets,
        types:
            edit ?
                widgets.types :
                readWidgets.types,
        custom:
            edit ?
                widgets.custom :
                readWidgets.custom,
    }), [widgets, edit])

    return <>
        <Helmet>
            <title>{t('brand')} · Content-UI</title>
        </Helmet>

        <Container maxWidth={'lg'} fixed>
            <Paper>
                <Box my={1}>
                    <Button onClick={() => setEdit(r => !r)}>
                        {edit ? 'read' : 'edit'}
                    </Button>
                    <Button onClick={() => setReadDense(r => !r)}>
                        {readDense ? 'normal-size' : 'dense'}
                    </Button>
                    <Button
                        onClick={() => setStore(s => s
                            .setIn(['values', 'name'], 'Example ' + (++i))
                            .setIn(['values', 'intro'], mdIntro)
                            .setIn(['values', 'content'], md),
                        )}
                    >
                        import example
                    </Button>
                </Box>
                <Box mx={1.5} mb={1}>
                    <UIMetaProvider<UIMetaReadContextType & { isVirtual?: boolean }>
                        widgets={rtdWidgets} t={tUI}
                        readDense={readDense} readActive={!edit}
                        // isVirtual={isVirtual}
                    >
                        <UIStoreProvider
                            store={store} onChange={onChange}
                            showValidity={Boolean((edit && showValidityOnRead) || (!edit && showValidity))}
                        >
                            <GridStack
                                isRoot
                                schema={schema}
                            />
                        </UIStoreProvider>
                    </UIMetaProvider>
                </Box>
            </Paper>
        </Container>
    </>
}
