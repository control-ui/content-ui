import Box from '@mui/material/Box'
import React, { useCallback } from 'react'
import {
    lineNumbers, highlightActiveLineGutter, highlightSpecialChars,
    drawSelection, dropCursor,
    rectangularSelection, highlightActiveLine, keymap,
    EditorView, highlightWhitespace, tooltips, highlightTrailingWhitespace,
} from '@codemirror/view'
import {
    foldGutter, indentOnInput, syntaxHighlighting,
    defaultHighlightStyle, bracketMatching, foldKeymap,
    StreamLanguage, LanguageDescription, LanguageSupport, codeFolding,
} from '@codemirror/language'
import { history, defaultKeymap, historyKeymap, indentWithTab } from '@codemirror/commands'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete'
import { lintKeymap } from '@codemirror/lint'
import { Compartment, EditorState, Extension, Prec } from '@codemirror/state'
import { CodeMirrorComponentProps, CodeMirrorProps } from '@ui-schema/kit-codemirror/CodeMirror'
import { EditorThemeCustomStyles, useEditorTheme } from '@ui-schema/material-code/useEditorTheme'
import { useHighlightStyle } from '@ui-schema/material-code/useHighlightStyle'
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
import { YAMLFrontMatter, Footnote, Mark, Hashtag, Mention, Insert } from './lezerMarkdown.js'
import { useCodeMirror } from '@ui-schema/kit-codemirror/useCodeMirror'
import { useExtension } from '@ui-schema/kit-codemirror/useExtension'
import { MuiCodeMirrorStyleProps } from '@ui-schema/material-code'
import { useTheme } from '@mui/material/styles'

const mdLang0 = markdown({
    base: markdownLanguage,
    codeLanguages: [
        LanguageDescription.of({
            name: 'YAML',
            alias: ['yaml', 'yml'],
            filename: /.(yaml|yml)$/i,
            extensions: ['yaml', 'yml'],
            support: new LanguageSupport(StreamLanguage.define(yaml)),
        }),
    ],
    extensions: [
        YAMLFrontMatter({allBlocks: true}),
        Footnote, Mark, Insert, Hashtag, Mention,
    ],
})

const mdLang = markdown({
    base: markdownLanguage,
    codeLanguages: [
        LanguageDescription.of({
            name: 'YAML',
            alias: ['yaml', 'yml'],
            filename: /.(yaml|yml)$/i,
            extensions: ['yaml', 'yml'],
            support: new LanguageSupport(StreamLanguage.define(yaml)),
        }),
        LanguageDescription.of({
            name: 'Markdown',
            alias: ['md', 'markdown'],
            extensions: ['md'],
            support: mdLang0,
        }),
        ...languages,
    ],
    extensions: [
        YAMLFrontMatter({allBlocks: true}),
        Footnote, Mark, Insert, Hashtag, Mention,
    ],
})

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
            return javascript({jsx: true})
        case 'ts':
        case 'typescript':
            return javascript({typescript: true})
        case 'tsx':
            return javascript({jsx: true, typescript: true})
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
            return mdLang
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
    lang?: string
    extraMods?: boolean
    enableTabIndent?: boolean
    highlightWhitespaces?: boolean
    autoFocus?: boolean | number
    paddingBottom?: boolean | number | string
    id?: string
    enableSpellCheck?: boolean
}

export const CustomCodeMirror: React.FC<CustomCodeMirrorProps> = (
    {
        value, extensions, lang,
        dense, variant: customVariant,
        classNameContent, onChange,
        onViewLifecycle,
        style,
        highlightWhitespaces,
        autoFocus,
        extraMods = true,
        enableTabIndent = true,
        paddingBottom = false,
        enableSpellCheck = false,
        id,
    },
) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null)
    const {palette} = useTheme()

    const editorStyle = React.useMemo<React.CSSProperties>(() => style || {}, [style])

    const customStyles = React.useMemo<Partial<EditorThemeCustomStyles>>(() => ({
        activeSelection: palette.mode === 'dark' ? '#182f2f' : 'rgba(210,243,239,0.76)',
        activeLine: palette.mode === 'dark' ? 'rgba(5, 115, 115, 0.11)' : 'rgba(216,234,231,0.34)',
        paddingBottom: paddingBottom,
    }), [palette.mode, paddingBottom])

    const theme = useEditorTheme(typeof onChange === 'undefined', dense, customVariant, customStyles as EditorThemeCustomStyles)
    const highlightStyle = useHighlightStyle({headlineUnderline: false})

    const baseExtensions = React.useMemo(() => [
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
        ...extraMods ? [
            codeFolding(),
            tooltips(),
        ] : [],
        new Compartment().of(EditorState.tabSize.of(4)),
        ...(extensions || []),
    ], [extraMods, extensions])

    const [editorRef] = useCodeMirror({
        onChange,
        value: value || '',
        extensions: baseExtensions,
        containerRef,
        onViewLifecycle,
    })

    useExtension(useCallback(() => classNameContent ? Prec.lowest(EditorView.editorAttributes.of({class: classNameContent})) : [], [classNameContent]), editorRef)
    useExtension(useCallback(() => syntaxHighlighting(highlightStyle || defaultHighlightStyle, {fallback: true}), [highlightStyle]), editorRef)
    useExtension(useCallback(() => theme, [theme]), editorRef)

    useExtension(useCallback(() =>
            enableSpellCheck ?
                EditorView.contentAttributes.of({autocorrect: 'on', autocapitalize: 'on', spellcheck: 'true'}) :
                EditorView.contentAttributes.of({})
        , [enableSpellCheck]), editorRef)

    useExtension(useCallback(() => {
        return onChange && highlightWhitespaces ? highlightWhitespace() : []
    }, [onChange, highlightWhitespaces]), editorRef)

    useExtension(useCallback(() => {
        const highlightExt = lang && getHighlight(lang)
        return highlightExt ? [highlightExt] : []
    }, [lang]), editorRef)

    useExtension(useCallback(() => {
        return keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap.filter(k => k.key !== 'Mod-Enter'),
            ...searchKeymap,
            ...historyKeymap,
            ...foldKeymap,
            ...completionKeymap,
            ...lintKeymap,
            ...enableTabIndent ? [indentWithTab] : [],
        ])
    }, [enableTabIndent]), editorRef)

    useExtension(useCallback(() => {
        return onChange && extraMods ? highlightTrailingWhitespace() : []
    }, [onChange, extraMods]), editorRef)


    React.useEffect(() => {
        const editor = editorRef.current
        if(!editor || !autoFocus) return
        const autoFocusDelay = typeof autoFocus === 'number' ? autoFocus : 75
        const setFocus = () => {
            if(editor.hasFocus) {
                window.clearInterval(timer)
                return
            }
            editor.focus()
            if(editor.hasFocus) {
                const length = editor.state.doc.length
                editor.dispatch({selection: {anchor: length, head: length}})
                window.clearInterval(timer)
            }
        }
        const timer = window.setInterval(setFocus, autoFocusDelay)
        return () => window.clearInterval(timer)
    }, [editorRef, autoFocus])

    return <Box
        id={id}
        ref={containerRef}
        sx={{
            fontSize: '0.913rem', ...editorStyle,
            position: onChange ? editorStyle?.position : 'relative',
            '.cm__actions': {display: 'none'},
            '&:hover .cm__actions': {display: 'flex'},
        }}
    />
}
