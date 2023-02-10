import { ok as assert } from 'uvu/assert'
import { splice } from 'micromark-util-chunked'
import { classifyCharacter } from 'micromark-util-classify-character'
import { resolveAll } from 'micromark-util-resolve-all'
import { codes } from 'micromark-util-symbol/codes'
import { constants } from 'micromark-util-symbol/constants'
import { types } from 'micromark-util-symbol/types'
import { containerPhrasing } from 'mdast-util-to-markdown/lib/util/container-phrasing'
import { track } from 'mdast-util-to-markdown/lib/util/track'
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

function mdInsert(): Extension {
    const tokenizer = {
        tokenize: tokenizeInsert,
        resolveAll: resolveAllInsert,
    }

    return {
        text: {
            [codes.plusSign]: tokenizer,
        },
        insideSpan: {null: [tokenizer]},
        attentionMarkers: {null: [codes.plusSign]},
    }

    function resolveAllInsert(...[events, context]: Parameters<Resolver>): ReturnType<Resolver> {
        let index = -1

        // Walk through all events.
        while(++index < events.length) {
            // Find a token that can close.
            if(
                events[index][0] === 'enter' &&
                events[index][1].type === 'insertSequenceTemporary' &&
                events[index][1]._close
            ) {
                let open = index

                // Now walk back to find an opener.
                while(open--) {
                    // Find a token that can open the closer.
                    if(
                        events[open][0] === 'exit' &&
                        events[open][1].type === 'insertSequenceTemporary' &&
                        events[open][1]._open &&
                        // If the sizes are the same:
                        events[index][1].end.offset - events[index][1].start.offset ===
                        events[open][1].end.offset - events[open][1].start.offset
                    ) {
                        events[index][1].type = 'insertSequence'
                        events[open][1].type = 'insertSequence'

                        const seq = {
                            type: 'insert',
                            start: Object.assign({}, events[open][1].start),
                            end: Object.assign({}, events[index][1].end),
                        }

                        const text = {
                            type: 'insertText',
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
            if(events[index][1].type === 'insertSequenceTemporary') {
                events[index][1].type = types.data
            }
        }

        return events
    }

    function tokenizeInsert(this: ThisParameterType<Tokenizer>, ...[effects, ok, nok]: Parameters<Tokenizer>): ReturnType<Tokenizer> {
        const previous = this.previous
        const events = this.events
        let size = 0

        return start

        function start(...[code]: Parameters<State>): ReturnType<State> {
            assert(code === codes.plusSign, 'expected `++`')

            if(
                previous === code &&
                events[events.length - 1][1].type !== types.characterEscape
            ) {
                return nok(code)
            }

            effects.enter('insertSequenceTemporary')
            return more(code)
        }

        function more(code) {
            const before = classifyCharacter(previous)

            if(code === codes.plusSign) {
                // If this is the third marker, exit.
                if(size > 1) return nok(code)
                effects.consume(code)
                size++
                return more
            }

            if(size !== 2) return nok(code)
            const token = effects.exit('insertSequenceTemporary')
            const after = classifyCharacter(code)
            token._open =
                !after || (after === constants.attentionSideAfter && Boolean(before))
            token._close =
                !before || (before === constants.attentionSideAfter && Boolean(after))
            return ok(code)
        }
    }
}

const insertFromMarkdown: FromMarkdownExtension = {
    canContainEols: [],
    enter: {
        insert: enterInsert,
    },
    exit: {
        insert: exitInsert,
    },
}

export const insertToMarkdown: ToMarkdownExtension & { handlers: Partial<Handlers & Record<'insert', Handle>> | null | undefined } = {
    unsafe: [{character: '+', inConstruct: 'phrasing'}],
    handlers: {insert: handleInsert},
}

function enterInsert(this: ThisParameterType<FromMarkdownHandle>, ...[token]: Parameters<FromMarkdownHandle>): ReturnType<FromMarkdownHandle> {
    this.enter({
        // @ts-ignore
        type: 'insert',
        data: {hName: 'ins'},
        children: [],
    }, token)
}

function exitInsert(this: ThisParameterType<FromMarkdownHandle>, ...[token]: Parameters<FromMarkdownHandle>): ReturnType<FromMarkdownHandle> {
    this.exit(token)
}

function handleInsert(...[node, , context, safeOptions]: Parameters<ToMarkdownHandle>): ReturnType<ToMarkdownHandle> {
    const tracker = track(safeOptions)
    const exit = context.enter('insert' as ConstructName)
    let value = tracker.move('++')
    value += containerPhrasing(node, context, {
        ...tracker.current(),
        before: value,
        after: '+',
    })
    value += tracker.move('++')
    exit()
    return value
}

handleInsert.peek = peekInsert

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function peekInsert(..._args: Parameters<ToMarkdownHandle>): ReturnType<ToMarkdownHandle> {
    return '+'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function remarkInsert(this: Processor, ..._args: Parameters<Plugin<[] | void[], Root>>): void {
    const data = this.data()

    add('micromarkExtensions', mdInsert())
    add('fromMarkdownExtensions', insertFromMarkdown)
    add('toMarkdownExtensions', insertToMarkdown)

    function add(field: string, value: unknown) {
        const list = (
            /* c8 ignore next 2 */
            data[field] ? data[field] : (data[field] = [])
        ) as unknown[]

        list.push(value)
    }
}
