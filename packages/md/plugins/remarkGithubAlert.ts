import type { Blockquote, Parents } from 'mdast'
import type { Info, Map, State } from 'mdast-util-to-markdown'

/**
 * A modified blockquote to-markdown stringify handler, compatible with remark-github-blockquote-alert
 *
 * @see {@link https://github.com/syntax-tree/mdast-util-to-markdown/blob/d0b9be9fe178210b1684fe07dcef3ddc5ec54ab2/lib/handle/blockquote.js} source of blockquote stringify
 */
export function blockquoteToMarkdown(node: Blockquote, _: Parents | undefined, state: State, info: Info) {
    const exit = state.enter('blockquote')
    const tracker = state.createTracker(info)
    tracker.move('> ')
    tracker.shift(2)
    if(
        typeof node.data?.hProperties?.class === 'string'
        && node.data?.hProperties?.class?.includes('markdown-alert')
    ) {
        const startLine = node.children[0]
        if(startLine.type === 'paragraph' && startLine.children[1].type === 'text') {
            const contentLines = node.children.slice(1)
            // remove leading blank lines (empty paragraphs) as otherwise `containerFlow` will add two `>` at the start
            // e.g. in:
            // > [!NOTE]
            // >
            // > Useful information that users should know, even when skimming content.
            //
            // ==> - will be kept as is and no two `>` between the startLine and the first content line
            //     - multiple will be reduced to a single `>` line between them;
            //     - no empty line will not add one
            //     - only `> [!NOTE]`, without content, will be kept as is
            let hasBlankLine = false
            for(const contentLine of contentLines) {
                if(
                    contentLine.type === 'paragraph'
                    && contentLine.children.length === 0
                ) {
                    contentLines.shift()
                    hasBlankLine = true
                } else {
                    break
                }
            }
            const valueStart = state.indentLines(
                `[!${startLine.children[1].value}]${hasBlankLine && contentLines.length ? '\n' : ''}`,
                map,
            )
            const value = contentLines.length ?
                '\n' +
                state.indentLines(
                    state.containerFlow({
                        type: 'blockquote',
                        children: contentLines,
                    }, tracker.current()),
                    map,
                ) : ''
            exit()
            return valueStart + value
        }
    }
    const value = state.indentLines(
        state.containerFlow(node, tracker.current()),
        map,
    )
    exit()
    return value
}

const map: Map = (line, _, blank) => {
    return '>' + (blank ? '' : ' ') + line
}
