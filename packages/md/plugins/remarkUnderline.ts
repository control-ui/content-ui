// @ts-nocheck
import { splice } from 'micromark-util-chunked'
import { classifyCharacter } from 'micromark-util-classify-character'
import { resolveAll } from 'micromark-util-resolve-all'
import { constants, codes, types } from 'micromark-util-symbol'
import { Extension } from 'micromark-util-types'
import { Resolver } from 'micromark-util-types'
import { Tokenizer } from 'micromark-util-types'
import { State } from 'micromark-util-types'
import { Root } from 'mdast'
import { Plugin, Processor } from 'unified'
import { Extension as FromMarkdownExtension } from 'mdast-util-from-markdown'
import { Handle as FromMarkdownHandle } from 'mdast-util-from-markdown'
import { Options as ToMarkdownExtension } from 'mdast-util-to-markdown'
import { Handle as ToMarkdownHandle } from 'mdast-util-to-markdown'
import { ConstructName, Handle, Handlers } from 'mdast-util-to-markdown/lib/types'

function mdUnderline(): Extension {
    const tokenizer = {
        tokenize: tokenizeUnderline,
        resolveAll: resolveAllUnderline,
    }

    return {
        text: {
            [codes.underscore]: tokenizer,
        },
        insideSpan: {null: [tokenizer]},
        attentionMarkers: {null: [codes.underscore]},
    }

    function resolveAllUnderline(...[events, context]: Parameters<Resolver>): ReturnType<Resolver> {
        let index = -1

        // Walk through all events.
        while(++index < events.length) {
            // Find a token that can close.
            if(
                events[index][0] === 'enter' &&
                events[index][1].type === 'underlineSequenceTemporary' &&
                events[index][1]._close
            ) {
                let open = index

                // Now walk back to find an opener.
                while(open--) {
                    // Find a token that can open the closer.
                    if(
                        events[open][0] === 'exit' &&
                        events[open][1].type === 'underlineSequenceTemporary' &&
                        events[open][1]._open &&
                        // If the sizes are the same:
                        events[index][1].end.offset - events[index][1].start.offset ===
                        events[open][1].end.offset - events[open][1].start.offset
                    ) {
                        events[index][1].type = 'underlineSequence'
                        events[open][1].type = 'underlineSequence'

                        const seq = {
                            type: 'underline',
                            start: Object.assign({}, events[open][1].start),
                            end: Object.assign({}, events[index][1].end),
                        }

                        const text = {
                            type: 'underlineText',
                            start: Object.assign({}, events[open][1].end),
                            end: Object.assign({}, events[index][1].start),
                        }

                        // Opening.
                        const nextEvents = [
                            ['enter', seq, context],
                            ['enter', events[open][1], context],
                            ['exit', events[open][1], context],
                            ['enter', text, context],
                        ]

                        // Between.
                        splice(
                            nextEvents,
                            nextEvents.length,
                            0,
                            resolveAll(
                                context.parser.constructs.insideSpan.null,
                                events.slice(open + 1, index),
                                context,
                            ),
                        )

                        // Closing.
                        splice(nextEvents, nextEvents.length, 0, [
                            ['exit', text, context],
                            ['enter', events[index][1], context],
                            ['exit', events[index][1], context],
                            ['exit', seq, context],
                        ])

                        splice(events, open - 1, index - open + 3, nextEvents)

                        index = open + nextEvents.length - 2
                        break
                    }
                }
            }
        }

        index = -1

        while(++index < events.length) {
            // todo: what does this do?
            if(events[index][1].type === 'underlineSequenceTemporary') {
                events[index][1].type = types.data
            }
        }

        return events
    }

    function tokenizeUnderline(this: ThisParameterType<Tokenizer>, ...[effects, ok, nok]: Parameters<Tokenizer>): ReturnType<Tokenizer> {
        const previous = this.previous
        const events = this.events
        let size = 0

        return start

        function start(...[code]: Parameters<State>): ReturnType<State> {
            // assert(code === codes.underscore, 'expected `__`')

            if(
                previous === code &&
                events[events.length - 1][1].type !== types.characterEscape
            ) {
                return nok(code)
            }

            effects.enter('underlineSequenceTemporary')
            return more(code)
        }

        function more(code) {
            const before = classifyCharacter(previous)

            if(code === codes.underscore) {
                // If this is the third marker, exit.
                if(size > 1) return nok(code)
                effects.consume(code)
                size++
                return more
            }

            if(size !== 2) return nok(code)
            const token = effects.exit('underlineSequenceTemporary')
            const after = classifyCharacter(code)
            token._open =
                !after || (after === constants.attentionSideAfter && Boolean(before))
            token._close =
                !before || (before === constants.attentionSideAfter && Boolean(after))
            return ok(code)
        }
    }
}

const underlineFromMarkdown: FromMarkdownExtension = {
    canContainEols: [],
    enter: {
        underline: enterUnderline,
    },
    exit: {
        underline: exitUnderline,
    },
}

export const underlineToMarkdown: ToMarkdownExtension & { handlers: Partial<Handlers & Record<'underline', Handle>> | null | undefined } = {
    unsafe: [{character: '_', inConstruct: 'phrasing'}],
    handlers: {underline: handleUnderline},
}

function enterUnderline(this: ThisParameterType<FromMarkdownHandle>, ...[token]: Parameters<FromMarkdownHandle>): ReturnType<FromMarkdownHandle> {
    this.enter({
        // @ts-ignore
        type: 'underline',
        data: {hName: 'u'},
        children: [],
    }, token)
}

function exitUnderline(this: ThisParameterType<FromMarkdownHandle>, ...[token]: Parameters<FromMarkdownHandle>): ReturnType<FromMarkdownHandle> {
    this.exit(token)
}

function handleUnderline(...[node, , state, info]: Parameters<ToMarkdownHandle>): ReturnType<ToMarkdownHandle> {
    const tracker = state.createTracker(info)
    const exit = state.enter('underline' as ConstructName)
    let value = tracker.move('__')
    value += state.containerPhrasing(node, state, {
        ...tracker.current(),
        before: value,
        after: '_',
    })
    value += tracker.move('__')
    exit()
    return value
}

handleUnderline.peek = peekUnderline

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function peekUnderline(..._args: Parameters<ToMarkdownHandle>): ReturnType<ToMarkdownHandle> {
    return '_'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function remarkUnderline(this: Processor, ..._args: Parameters<Plugin<[] | void[], Root>>): void {
    const data = this.data()

    add('micromarkExtensions', mdUnderline())
    add('fromMarkdownExtensions', underlineFromMarkdown)
    add('toMarkdownExtensions', underlineToMarkdown)

    function add(field: string, value: unknown) {
        const list = (
            /* c8 ignore next 2 */
            data[field] ? data[field] : (data[field] = [])
        ) as unknown[]

        list.push(value)
    }
}
