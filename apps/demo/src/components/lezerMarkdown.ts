/**
 * Copied and adjusted, https://github.com/erykwalder/lezer-markdown-obsidian/blob/6223674c535addf0fa60c8a04e3ebf5fd8aa3d7e/src/extensions.ts
 * @licence MIT 2023 Eric Rykwalder, see file LICENSE_LEZER-MD.md
 */
import { foldNodeProp, StreamLanguage } from '@codemirror/language'
import { yaml } from '@codemirror/legacy-modes/mode/yaml'
import { Input, parseMixed } from '@lezer/common'
import {
    BlockContext,
    Element,
    InlineContext,
    LeafBlock,
    LeafBlockParser,
    Line,
    MarkdownConfig,
    DelimiterType,
} from '@lezer/markdown'
import { styleTags, tags } from '@lezer/highlight'

declare module '@lezer/markdown' {
    interface BlockContext {
        readonly input: Input
        checkedYaml: boolean | null
    }
}

interface BlockContextWithInput extends BlockContext {
    readonly input: Input
}

const CommentDelim = {resolve: 'Comment', mark: 'CommentMarker'}

export const Comment: MarkdownConfig = {
    defineNodes: ['Comment', 'CommentMarker'],
    parseBlock: [
        {
            name: 'CommentBlock',
            endLeaf: (_, line: Line) => {
                return line.text.slice(line.pos, line.pos + 2) == '%%'
            },
            parse(cx: BlockContext, line: Line) {
                if(line.text.slice(line.pos, line.pos + 2) != '%%') {
                    return false
                }
                const start = cx.lineStart + line.pos
                const markers = [cx.elt('CommentMarker', start, start + 2)]
                const regex = /(^|[^\\])%%/
                let remaining = line.text.slice(line.pos + 2)
                let startOffset = 2
                let match
                while(!(match = regex.exec(remaining)) && cx.nextLine()) {
                    remaining = line.text
                    startOffset = 0
                }
                let end
                if(match) {
                    const lineEnd = match.index + match[0].length + startOffset
                    end = cx.lineStart + lineEnd
                    markers.push(cx.elt('CommentMarker', end - 2, end))
                    if(
                        lineEnd == line.text.length ||
                        /^\s+$/.test(line.text.slice(lineEnd))
                    ) {
                        cx.nextLine()
                    } else {
                        line.pos = line.skipSpace(lineEnd)
                    }
                } else {
                    end = cx.lineStart + line.text.length
                }
                cx.addElement(cx.elt('Comment', start, end, markers))
                return true
            },
        },
    ],
    parseInline: [
        {
            name: 'CommentInline',
            parse(cx: InlineContext, next: number, pos: number) {
                if(next == 37 && cx.char(pos + 1) == 37) {
                    let canClose = true
                    if(
                        cx.slice(cx.offset, pos).lastIndexOf('\n') >
                        cx.slice(cx.offset, pos).lastIndexOf('%%')
                    ) {
                        canClose = false
                    }
                    return cx.addDelimiter(CommentDelim, pos, pos + 2, true, canClose)
                }
                return -1
            },
        },
    ],
}

class FootnoteReferenceParser implements LeafBlockParser {
    constructor(private labelEnd: number) {
    }

    nextLine(cx: BlockContext, line: Line, leaf: LeafBlock) {
        if(isFootnoteRef(line.text) != -1) {
            return this.complete(cx, leaf)
        }
        return false
    }

    finish(cx: BlockContext, leaf: LeafBlock) {
        return this.complete(cx, leaf)
    }

    complete(cx: BlockContext, leaf: LeafBlock) {
        cx.addLeafElement(
            leaf,
            cx.elt(
                'FootnoteReference',
                leaf.start,
                leaf.start + leaf.content.length,
                [
                    cx.elt('FootnoteMark', leaf.start, leaf.start + 2),
                    cx.elt('FootnoteLabel', leaf.start + 2, this.labelEnd - 2),
                    cx.elt('FootnoteMark', this.labelEnd - 2, this.labelEnd),
                    ...cx.parser.parseInline(
                        leaf.content.slice(this.labelEnd - leaf.start),
                        this.labelEnd,
                    ),
                ],
            ),
        )
        return true
    }
}

export const Footnote: MarkdownConfig = {
    defineNodes: [
        'Footnote',
        'FootnoteLabel',
        'FootnoteMark',
        'FootnoteReference',
    ],
    parseInline: [
        {
            name: 'Footnote',
            parse(cx: InlineContext, _, pos: number) {
                // typically [^1], but inside can match any characters but
                // square brackets and spaces.
                const match = /^\[\^[^\s[\]]+\]/.exec(cx.text.slice(pos - cx.offset))
                if(match) {
                    const end = pos + match[0].length
                    return cx.addElement(
                        cx.elt('Footnote', pos, end, [
                            cx.elt('FootnoteMark', pos, pos + 2),
                            cx.elt('FootnoteLabel', pos + 2, end - 1),
                            cx.elt('FootnoteMark', end - 1, end),
                        ]),
                    )
                }
                return -1
            },
            before: 'Link',
        },
    ],
    parseBlock: [
        {
            name: 'FootnoteReference',
            leaf(_, leaf: LeafBlock): LeafBlockParser | null {
                const ref = isFootnoteRef(leaf.content)
                if(ref != -1) {
                    return new FootnoteReferenceParser(leaf.start + ref)
                }
                return null
            },
            before: 'LinkReference',
        },
    ],
    props: [
        styleTags({
            'FootnoteReference': [tags.content, tags.emphasis],
            'FootnoteMark': tags.processingInstruction,
            'FootnoteLabel': [tags.link, tags.url],
        }),
    ],
}

function isFootnoteRef(content: string): number {
    const match = /^\[\^[^\s[\]]+\]:/.exec(content)
    return match ? match[0].length : -1
}

const hashtagRE =
    /^[^\u2000-\u206F\u2E00-\u2E7F'!"#$%&()*+,.:;<=>?@^`{|}~[\]\\\s]+/

export const Hashtag: MarkdownConfig = {
    defineNodes: ['Hashtag', 'HashtagMark', 'HashtagLabel'],
    parseInline: [
        {
            name: 'Hashtag',
            parse(cx: InlineContext, next: number, pos: number) {
                if(next != 35 /* # */) {
                    return -1
                }
                const start = pos
                pos += 1
                const match = hashtagRE.exec(cx.text.slice(pos - cx.offset))
                if(match && /[\D|\d]/.test(match[0])) {
                    pos += match[0].length
                    return cx.addElement(
                        cx.elt('Hashtag', start, pos, [
                            cx.elt('HashtagMark', start, start + 1),
                            cx.elt('HashtagLabel', start + 1, pos),
                        ]),
                    )
                }
                return -1
            },
        },
    ],
    props: [
        styleTags({
            'Hashtag': tags.url,
            'HashtagMark': tags.processingInstruction,
            'HashtagLabel': [tags.link, tags.url],
        }),
    ],
}

// removed `dot` here to allow that for combined names
const mentionRE =
    /^[^\u2000-\u206E\u2E00-\u2E7F'!"#$%&()*+,:;<=>?^`{|}~[\]\\\s]+/

export const Mention: MarkdownConfig = {
    defineNodes: ['Mention', 'MentionMark', 'MentionLabel'],
    parseInline: [
        {
            name: 'Mention',
            parse(cx: InlineContext, next: number, pos: number) {
                if(next != 64 /* @ */) {
                    return -1
                }
                const start = pos
                pos += 1
                const match = mentionRE.exec(cx.text.slice(pos - cx.offset))
                if(match && /[\D|\d]/.test(match[0])) {
                    pos += match[0].length
                    if(match[0][match[0].length - 1] === '.') {
                        // if the last is a dot, exclude dot again, e.g. sentence endings
                        pos -= 1
                    }
                    return cx.addElement(
                        cx.elt('Mention', start, pos, [
                            cx.elt('MentionMark', start, start + 1),
                            cx.elt('MentionLabel', start + 1, pos),
                        ]),
                    )
                }
                return -1
            },
        },
    ],
    props: [
        styleTags({
            'Mention': tags.url,
            'MentionMark': tags.processingInstruction,
            'MentionLabel': [tags.link, tags.url],
        }),
    ],
}

export const InternalLink: MarkdownConfig = {
    defineNodes: [
        'Embed',
        'EmbedMark',
        'InternalLink',
        'InternalMark',
        'InternalPath',
        'InternalSubpath',
        'InternalDisplay',
    ],
    parseInline: [
        {
            name: 'InternalLink',
            parse(cx: InlineContext, _, pos: number) {
                const el = parseInternalLink(cx, pos)
                if(el) {
                    return cx.addElement(el)
                }
                return -1
            },
            before: 'Link',
        },
        {
            name: 'Embed',
            parse(cx: InlineContext, next: number, pos: number): number {
                if(next != 33) {
                    return -1
                }
                const link = parseInternalLink(cx, pos + 1)
                if(link) {
                    const embedMark = cx.elt('EmbedMark', pos, pos + 1)
                    return cx.addElement(
                        cx.elt('Embed', pos, link.to, [embedMark, link]),
                    )
                }
                return -1
            },
            before: 'Image',
        },
    ],
}

function parseInternalLink(cx: InlineContext, pos: number): Element | null {
    if(
        cx.char(pos) != 91 /* [ */ ||
        cx.char(pos + 1) != 91 ||
        !isClosedLink(cx, pos)
    ) {
        return null
    }
    const contents: Element[] = []
    contents.push(cx.elt('InternalMark', pos, pos + 2))
    pos = cx.skipSpace(pos + 2)
    const path = parsePath(cx, pos - cx.offset, cx.offset)
    if(path) {
        contents.push(path)
        pos = cx.skipSpace(path.to)
    }
    const subpath = parseSubpath(cx, pos)
    if(subpath) {
        contents.push(subpath)
        pos = cx.skipSpace(subpath.to)
    }
    if(path == null && subpath == null) {
        return null
    }
    if(cx.char(pos) == 124 /* | */) {
        contents.push(cx.elt('InternalMark', pos, pos + 1))
        pos += 1
        const display = parseDisplay(cx, pos)
        if(display) {
            contents.push(display)
            pos = cx.skipSpace(display.to)
        }
    }
    contents.push(cx.elt('InternalMark', pos, pos + 2))
    return cx.elt(
        'InternalLink',
        contents[0].from,
        contents[contents.length - 1].to,
        contents,
    )
}

function isClosedLink(cx: InlineContext, start: number): boolean {
    for(let pos = start + 2; pos < cx.end; pos++) {
        if(cx.char(pos) == 91 /* [ */ && cx.char(pos + 1) == 91) {
            return false
        } else if(cx.char(pos) == 93 /* ] */ && cx.char(pos + 1) == 93) {
            // return false for empty
            // true otherwise
            return pos > start + 2
        }
    }
    return false
}

function parsePath(
    cx: InlineContext,
    start: number,
    offset: number,
): Element | null {
    // anything but: |[]#^\/
    const match = /^[^[\]|#^\\/]+/.exec(cx.text.slice(start))
    if(match) {
        return cx.elt(
            'InternalPath',
            offset + start,
            offset + start + match[0].length,
        )
    }
    return null
}

function parseSubpath(cx: InlineContext, start: number): Element | null {
    if(cx.char(start) != 35 /* # */) {
        return null
    }
    for(let pos = start + 1; pos < cx.end; pos++) {
        if(
            cx.char(pos) == 124 /* | */ ||
            (cx.char(pos) == 93 /* ] */ && cx.char(pos + 1) == 93)
        ) {
            return cx.elt('InternalSubpath', start, pos)
        }
    }
    return null
}

function parseDisplay(cx: InlineContext, start: number): Element | null {
    for(let pos = start; pos < cx.end; pos++) {
        if(cx.char(pos) == 93 /* ] */ && cx.char(pos + 1) == 93) {
            if(pos == start) {
                return null
            }
            return cx.elt('InternalDisplay', start, pos)
        }
    }
    return null
}

export const MarkDelim = {resolve: 'Mark', mark: 'MarkMarker'}

export const Mark: MarkdownConfig = {
    defineNodes: ['Mark', 'MarkMarker'],
    parseInline: [
        {
            name: 'Mark',
            parse(cx: InlineContext, next: number, pos: number) {
                if(next != 61 /* '=' */ || cx.char(pos + 1) != 61) return -1
                return cx.addDelimiter(MarkDelim, pos, pos + 2, true, true)
            },
        },
    ],
    props: [
        styleTags({
            'MarkMarker': tags.meta,
        }),
    ],
}

export const InsertDelim: DelimiterType = {resolve: 'Insert', mark: 'InsertMarker'}

export const Insert: MarkdownConfig = {
    defineNodes: ['Insert', 'InsertMarker'],
    parseInline: [
        {
            name: 'Insert',
            parse(cx: InlineContext, next: number, pos: number) {
                if(next != 43 /* '+' */ || cx.char(pos + 1) != 43) return -1
                return cx.addDelimiter(InsertDelim, pos, pos + 2, true, true)
            },
        },
    ],
    props: [
        styleTags({
            'InsertMarker': [tags.meta, tags.inserted],
        }),
    ],
}

/*
  Copyright (C) 2020 by Marijn Haverbeke <marijnh@gmail.com> and others
  https://github.com/lezer-parser/markdown/blob/f49eb8c8c82cfe45aa213ca1fe2cebc95305b88b/LICENSE
*/
class TaskParser implements LeafBlockParser {
    nextLine() {
        return false
    }

    finish(cx: BlockContext, leaf: LeafBlock) {
        cx.addLeafElement(
            leaf,
            cx.elt('Task', leaf.start, leaf.start + leaf.content.length, [
                cx.elt('TaskMarker', leaf.start, leaf.start + 3),
                ...cx.parser.parseInline(leaf.content.slice(3), leaf.start + 3),
            ]),
        )
        return true
    }
}

/// Extension providing
/// [GFM-style](https://github.github.com/gfm/#task-list-items-extension-)
/// task list items, where list items can be prefixed with `[ ]` or
/// `[x]` to add a checkbox.
/// `x` can be any character
export const TaskList: MarkdownConfig = {
    defineNodes: [{name: 'Task', block: true}, 'TaskMarker'],
    parseBlock: [
        {
            name: 'TaskList',
            leaf(cx: BlockContext, leaf: LeafBlock) {
                return /^\[.\]/.test(leaf.content) && cx.parentType().name == 'ListItem'
                    ? new TaskParser()
                    : null
            },
            after: 'SetextHeading',
        },
    ],
}
/* End Copyright */

const TexDelim = {resolve: 'TexInline', mark: 'TexMarker'}

export const Tex: MarkdownConfig = {
    defineNodes: ['TexBlock', 'TexInline', 'TexMarker'],
    parseBlock: [
        {
            name: 'TexBlock',
            endLeaf: (_, line: Line) =>
                line.text.slice(line.pos, line.pos + 2) == '$$',
            // This is an imperfect match for HyperMD, because
            // in HyperMD the block can start even in inline content.
            parse(cx: BlockContext, line: Line) {
                if(line.text.slice(line.pos, line.pos + 2) != '$$') {
                    return false
                }
                const start = cx.lineStart + line.pos
                const markers = [cx.elt('TexMarker', start, start + 2)]
                const regex = /(^|[^\\])\$\$/
                let remaining = line.text.slice(line.pos + 2)
                let startOffset = 2
                let match
                while(!(match = regex.exec(remaining)) && cx.nextLine()) {
                    remaining = line.text
                    startOffset = 0
                }
                let end
                if(match) {
                    const lineEnd = match.index + match[0].length + startOffset
                    end = cx.lineStart + lineEnd
                    markers.push(cx.elt('TexMarker', end - 2, end))
                    if(
                        lineEnd == line.text.length ||
                        /^\s+$/.test(line.text.slice(lineEnd))
                    ) {
                        cx.nextLine()
                    } else {
                        line.pos = line.skipSpace(lineEnd)
                    }
                } else {
                    end = cx.lineStart + line.text.length
                }
                cx.addElement(cx.elt('TexBlock', start, end, markers))
                return true
            },
        },
    ],
    parseInline: [
        {
            name: 'TexInline',
            parse(cx: InlineContext, next: number, pos: number) {
                if(next != 36 /* $ */) {
                    return -1
                }
                const before = cx.slice(pos - 1, pos)
                const after = cx.slice(pos + 1, pos + 2)
                const canClose = /[^ \t]/.test(before) && !/\d/.test(after)
                const canOpen = /[^$ \t]/.test(after)
                return cx.addDelimiter(TexDelim, pos, pos + 1, canOpen, canClose)
            },
        },
    ],
}

export const YAMLFrontMatter: (options?: { allBlocks?: boolean }) => MarkdownConfig = ({allBlocks} = {}) => ({
    defineNodes: ['YAMLFrontMatter', 'YAMLMarker', 'YAMLContent'],
    parseBlock: [
        {
            name: 'YAMLFrontMatter',
            before: 'FencedCode',
            parse(cx: BlockContextWithInput, line: Line) {
                // if(cx.insideYaml) {
                //     return false
                // }
                const start = cx.lineStart

                // abort when not at start and not wanting all blocks
                if(cx.prevLineEnd() !== -1 && !allBlocks) {
                    // cx.insideYaml = true
                    return false
                }

                // const chunk = cx.input.chunk(start)
                // line.addMarker()
                // ignoring blocks with new lines after the start-line, to not highlight actual content with hr around
                if(line.text !== '---' || cx.input.read(start + 3, start + 3 + 2) === '\n\n') return false

                const lastLineEnd = cx.input.read(cx.prevLineEnd() - 1, cx.prevLineEnd() + 1)

                if(
                    cx.prevLineEnd() === -1 ||
                    lastLineEnd === '\n\n' || lastLineEnd === '\r\n\r\n'
                ) {
                    // cx.insideYaml = true

                    // todo: improve this check, when just using `nextLine` this will overwrite anything afterwards
                    //       but `---` is also for hr, thus may be existing just once
                    //       and currently does not correctly work when changing only one marker, as incrementally read seems to be lost
                    const contentToEnd = cx.input.read(start, cx.input.length)
                    const hasEndLine = contentToEnd.indexOf('\n---\n')

                    if(hasEndLine === -1) return false
                    let end: number | undefined
                    do {
                        if(cx.lineStart !== start && cx.input.chunk(cx.lineStart) === '---') {
                            end = cx.lineStart
                        }
                    } while(typeof end === 'undefined' && cx.nextLine())

                    if(typeof end === 'undefined') {
                        return false
                    }

                    if(allBlocks) {
                        // just kept this marker as not sure how exactly nested langs work,
                        // is sharing the cx while iterating above, then it may be needed
                        // cx.insideYaml = false
                    }

                    cx.addElement(
                        cx.elt('YAMLFrontMatter', start, end, [
                            cx.elt('YAMLMarker', start, start + 3),
                            cx.elt('YAMLContent', start + 4, end - 1),
                            cx.elt('YAMLMarker', end, end + 3),
                        ]),
                    )
                    return true
                }
                return false
            },
        },
    ],
    props: [
        styleTags({
            'YAMLMarker': [tags.strong, tags.blockComment],
            'YAMLContent': tags.blockComment,
        }),
        foldNodeProp.add({
            'YAMLFrontMatter'(tree) {
                const first = tree.firstChild, last = tree.lastChild!
                if(!first || first.name != 'YAMLMarker') return null
                return {from: first.to, to: last.name == 'YAMLMarker' ? last.to : tree.to}
            },
        }),
    ],
    wrap: parseMixed(node => {
        return node.name === 'YAMLContent' ? {
            parser: StreamLanguage.define(yaml).parser,
            // overlay: node => node.type.name == 'Text',
        } : null
    }),
})
