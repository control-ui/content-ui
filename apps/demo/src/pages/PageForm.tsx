import Paper from '@mui/material/Paper'
import { createStore, onChangeHandler, storeUpdater, UIStoreProvider, UIStoreType, useUIMeta, WidgetEngine } from '@ui-schema/react'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { UIMetaReadContextType } from '@ui-schema/react/UIMetaReadContext'
import { createOrderedMap } from '@ui-schema/ui-schema'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { readWidgets } from '../components/UISchema.js'
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

const schema = createOrderedMap({
    type: 'object',
    properties: {
        name: {
            type: 'string',
            view: {
                sizeMd: 6,
                sizeLg: 9,
            },
        },
        country: {
            type: 'string',
            view: {
                sizeMd: 6,
                sizeLg: 3,
            },
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

const showValidityOnRead = false
const showValidity = false

let i = 0

export const PageForm: React.ComponentType = () => {
    const {t} = useTranslation('translation')
    const [edit, setEdit] = React.useState(false)
    const {binding, t: tUI, validate} = useUIMeta()
    const [readDense, setReadDense] = React.useState(false)
    const [store, setStore] = React.useState<UIStoreType>(() => createStore(OrderedMap({})))

    const onChange: onChangeHandler = React.useCallback((actions) => {
        setStore(storeUpdater(actions))
    }, [setStore])

    const rtdBinding = React.useMemo(() => ({
        ...binding,
        widgets:
            edit ?
                binding?.widgets :
                readWidgets,
    }), [binding, edit])

    return <>
        <>
            <title>{t('brand')} · Content-UI</title>
        </>

        <Container maxWidth={'lg'} fixed>
            <Paper
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box my={1} mx={1.5}>
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

                <Box mx={1.5} pt={1} pb={1} mb={1}>
                    <UIMetaProvider<UIMetaReadContextType & { isVirtual?: boolean }>
                        binding={rtdBinding} t={tUI}
                        readDense={readDense} readActive={!edit}
                        validate={validate}
                        // isVirtual={isVirtual}
                    >
                        <UIStoreProvider
                            store={store} onChange={onChange}
                            showValidity={Boolean((edit && showValidityOnRead) || (!edit && showValidity))}
                        >
                            <GridContainer>
                                <WidgetEngine
                                    isRoot
                                    schema={schema}
                                />
                            </GridContainer>
                        </UIStoreProvider>
                    </UIMetaProvider>
                </Box>
            </Paper>
        </Container>
    </>
}
