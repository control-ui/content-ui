import React from 'react'
import {
    lineNumbers, highlightActiveLineGutter, highlightSpecialChars,
    drawSelection, dropCursor,
    rectangularSelection, highlightActiveLine, keymap,
    EditorView,
    // crosshairCursor,
} from '@codemirror/view'
import {
    foldGutter, indentOnInput, syntaxHighlighting,
    defaultHighlightStyle, bracketMatching, foldKeymap,
    StreamLanguage,
} from '@codemirror/language'
import { history, defaultKeymap, historyKeymap, indentWithTab } from '@codemirror/commands'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete'
import { lintKeymap } from '@codemirror/lint'
import { Compartment, EditorState, Extension } from '@codemirror/state'
import { CodeMirrorComponentProps, CodeMirrorProps } from '@ui-schema/kit-codemirror/CodeMirror'
import { EditorThemeCustomStyles, useEditorTheme } from '@ui-schema/material-code/useEditorTheme'
import { useHighlightStyle } from './useHighlightStyle'
import { json } from '@codemirror/lang-json'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { python } from '@codemirror/lang-python'
import { wast } from '@codemirror/lang-wast'
import { rust } from '@codemirror/lang-rust'
import { xml } from '@codemirror/lang-xml'
import { php } from '@codemirror/lang-php'
import { MariaSQL, Cassandra, MySQL, PostgreSQL, MSSQL, StandardSQL, sql } from '@codemirror/lang-sql'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { lezer } from '@codemirror/lang-lezer'
import { sCSS } from '@codemirror/legacy-modes/mode/css'
import { shell } from '@codemirror/legacy-modes/mode/shell'
import { csharp } from '@codemirror/legacy-modes/mode/clike'
import { powerShell } from '@codemirror/legacy-modes/mode/powershell'
import { http } from '@codemirror/legacy-modes/mode/http'
import { yaml } from '@codemirror/legacy-modes/mode/yaml'
import { YAMLFrontMatter, Footnote, Mark, Hashtag, Mention, Insert } from './lezerMarkdown'
import { useCodeMirror, useEditorClasses, useExtension } from '@ui-schema/kit-codemirror'
import { MuiCodeMirrorStyleProps } from '@ui-schema/material-code'
import { useTheme } from '@mui/material/styles'

export const getHighlight = (lang: string | undefined): Extension | undefined => {
    switch(lang?.toLowerCase()) {
        case 'json':
        case 'json5':
            return json()
        case 'js':
        case 'node':
        case 'nodejs':
        case 'javascript':
            return javascript()
        case 'jsx':
            return javascript({
                jsx: true,
            })
        case 'ts':
        case 'typescript':
            return javascript({
                typescript: true,
            })
        case 'tsx':
            return javascript({
                jsx: true,
                typescript: true,
            })
        case 'twig':
        case 'html':
            return html()
        case 'rss':
        case 'wsl':
        case 'xsd':
        case 'xml':
            return xml()
        case 'bash':
        case 'sh':
        case 'zsh':
        case 'ksh':
        case 'shell':
            return StreamLanguage.define(shell)
        case 'powershell':
            return StreamLanguage.define(powerShell)
        case 'c#':
        case 'cs':
        case 'csharp':
            return StreamLanguage.define(csharp)
        case 'scss':
        case 'sass':
            return StreamLanguage.define(sCSS)
        case 'http':
            return StreamLanguage.define(http)
        case 'yml':
        case 'yaml':
            return StreamLanguage.define(yaml)
        case 'css':
            return css()
        case 'python':
            return python()
        case 'wast':
            return wast()
        case 'rust':
            return rust()
        case 'injectablephp':
        case 'php':
            return php()
        case 'mysql':
            return sql({dialect: MySQL})
        case 'ms sql':
        case 'mssql':
            return sql({dialect: MSSQL})
        case 'mariasql':
            return sql({dialect: MariaSQL})
        case 'postgresql':
            return sql({dialect: PostgreSQL})
        case 'cassandra':
        case 'cql':
            return sql({dialect: Cassandra})
        case 'bigquery':
        case 'standardsql':
            return sql({dialect: StandardSQL})
        case 'sql':
            return sql()
        case 'md':
        case 'markdown':
            // return markdown()
            return markdown({
                base: markdownLanguage,
                codeLanguages: languages,
                extensions: [
                    //GFM, Subscript, Superscript,
                    YAMLFrontMatter,
                    Footnote, Mark, Insert, Hashtag, Mention,
                ],
                /*extensions: [
                    YAMLFrontMatter,
                    Footnote,
                ],*/
            })
        case 'lezer':
            return lezer()
        default:
            return undefined
    }
}

export type CustomCodeMirrorProps = CodeMirrorComponentProps & MuiCodeMirrorStyleProps & {
    dense?: boolean
    onViewLifecycle?: CodeMirrorProps['onViewLifecycle']
    style?: React.CSSProperties
    // containerRef?: React.MutableRefObject<HTMLDivElement | null>
    lang?: string
}

export const CustomCodeMirror: React.FC<CustomCodeMirrorProps> = (
    {
        // values we want to override in this component
        value, extensions, lang,
        dense, variant: customVariant,
        classNamesContent, onChange,
        onViewLifecycle, effects,
        style,
    },
) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null)
    // containerRef.current ||= containerRefProps?.current || null
    // refs for extensions need to be created before the extension
    const editorAttributesCompartment = React.useRef<Compartment>(new Compartment())
    // todo: that `objet.values` here doesn't get changes when value keeps the same but property name has changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const editorStyle = React.useMemo<React.CSSProperties>(() => style || {}, [Object.values(style || {})])
    const {palette} = useTheme()

    const customStyles = React.useMemo<Partial<EditorThemeCustomStyles>>(() => ({
        activeSelection: palette.mode === 'dark' ? '#113838' : '#97f7e6',
        activeLine: palette.mode === 'dark' ? 'rgba(5, 115, 115, 0.11)' : 'rgba(206,230,228,0.34)',
    }), [palette.mode])
    const theme = useEditorTheme(typeof onChange === 'undefined', dense, customVariant, customStyles as EditorThemeCustomStyles)
    const highlightStyle = useHighlightStyle()
    const {init: initHighlightExt, effects: effectsHighlightExt} = useExtension(
        () => syntaxHighlighting(highlightStyle || defaultHighlightStyle, {fallback: true}),
        [highlightStyle],
    )
    const {init: initThemeExt, effects: effectsThemeExt} = useExtension(
        () => theme,
        [theme],
    )
    const effectsRef = React.useRef<((editor: EditorView) => void)[]>(effects || [])

    const extensionsAll = React.useMemo(() => [
        editorAttributesCompartment.current.of(EditorView.editorAttributes.of({})),
        lineNumbers(),
        EditorView.lineWrapping,
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        rectangularSelection(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        new Compartment().of(EditorState.tabSize.of(4)),
        keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...searchKeymap,
            ...historyKeymap,
            ...foldKeymap,
            ...completionKeymap,
            ...lintKeymap,
            indentWithTab,
        ]),
        initHighlightExt(),
        initThemeExt(),
        ...lang && getHighlight(lang) ? [getHighlight(lang) as Extension] : [],
        ...(extensions || []),
    ], [extensions, lang, initHighlightExt, initThemeExt])

    // attach parent plugin effects first
    React.useMemo(() => {
        if(!effects) return effectsRef.current
        effectsRef.current.push(...effects)
    }, [effects])

    // attach each plugin effect separately (thus only the one which changes get reconfigured)
    React.useMemo(() => {
        if(!effectsHighlightExt) return
        effectsRef.current.push(...effectsHighlightExt)
    }, [effectsHighlightExt])
    React.useMemo(() => {
        if(!effectsThemeExt) return
        effectsRef.current.push(...effectsThemeExt)
    }, [effectsThemeExt])

    const editor = useCodeMirror(
        onChange,
        value,
        extensionsAll,
        effectsRef.current.splice(0, effectsRef.current.length),
        containerRef,
        undefined,
        onViewLifecycle,
    )

    // but extensions need to receive both: Compartment and Editor (and optionally their values)
    // to be able to dispatch the correct effects
    useEditorClasses(editorAttributesCompartment.current, editor, classNamesContent)

    return <div ref={containerRef} style={editorStyle}/>
}
