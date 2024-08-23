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
import {
    Extension as FromMarkdownExtension,
    Handle as FromMarkdownHandle,
} from 'mdast-util-from-markdown'
import {
    Options as ToMarkdownExtension,
    Handle as ToMarkdownHandle,
    ConstructName, Handlers,
} from 'mdast-util-to-markdown'

function mdMark(): Extension {
    const tokenizer = {
        tokenize: tokenizeMark,
        resolveAll: resolveAllMark,
    }

    return {
        text: {
            [codes.equalsTo]: tokenizer,
        },
        insideSpan: {null: [tokenizer]},
        attentionMarkers: {null: [codes.equalsTo]},
    }

    function resolveAllMark(...[events, context]: Parameters<Resolver>): ReturnType<Resolver> {
        let index = -1

        // Walk through all events.
        while(++index < events.length) {
            // Find a token that can close.
            if(
                events[index][0] === 'enter' &&
                events[index][1].type === 'markSequenceTemporary' &&
                events[index][1]._close
            ) {
                let open = index

                // Now walk back to find an opener.
                while(open--) {
                    // Find a token that can open the closer.
                    if(
                        events[open][0] === 'exit' &&
                        events[open][1].type === 'markSequenceTemporary' &&
                        events[open][1]._open &&
                        // If the sizes are the same:
                        events[index][1].end.offset - events[index][1].start.offset ===
                        events[open][1].end.offset - events[open][1].start.offset
                    ) {
                        events[index][1].type = 'markSequence'
                        events[open][1].type = 'markSequence'

                        const seq = {
                            type: 'mark',
                            start: Object.assign({}, events[open][1].start),
                            end: Object.assign({}, events[index][1].end),
                        }

                        const text = {
                            type: 'markText',
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
            if(events[index][1].type === 'markSequenceTemporary') {
                events[index][1].type = types.data
            }
        }

        return events
    }

    function tokenizeMark(this: ThisParameterType<Tokenizer>, ...[effects, ok, nok]: Parameters<Tokenizer>): ReturnType<Tokenizer> {
        const previous = this.previous
        const events = this.events
        let size = 0

        return start

        function start(...[code]: Parameters<State>): ReturnType<State> {
            // assert(code === codes.equalsTo, 'expected `==`')

            if(
                previous === code &&
                events[events.length - 1][1].type !== types.characterEscape
            ) {
                return nok(code)
            }

            effects.enter('markSequenceTemporary')
            return more(code)
        }

        function more(code) {
            const before = classifyCharacter(previous)

            if(code === codes.equalsTo) {
                // If this is the third marker, exit.
                if(size > 1) return nok(code)
                effects.consume(code)
                size++
                return more
            }

            if(size !== 2) return nok(code)
            const token = effects.exit('markSequenceTemporary')
            const after = classifyCharacter(code)
            token._open =
                !after || (after === constants.attentionSideAfter && Boolean(before))
            token._close =
                !before || (before === constants.attentionSideAfter && Boolean(after))
            return ok(code)
        }
    }
}

const markFromMarkdown: FromMarkdownExtension = {
    canContainEols: [],
    enter: {
        mark: enterMark,
    },
    exit: {
        mark: exitMark,
    },
}

export const markToMarkdown: ToMarkdownExtension & { handlers: Partial<Handlers & Record<'mark', ToMarkdownHandle>> | null | undefined } = {
    unsafe: [{character: '=', inConstruct: 'phrasing'}],
    handlers: {mark: handleMark},
}

function enterMark(this: ThisParameterType<FromMarkdownHandle>, ...[token]: Parameters<FromMarkdownHandle>): ReturnType<FromMarkdownHandle> {
    this.enter({
        // @ts-ignore
        type: 'mark',
        data: {hName: 'ins'},
        children: [],
    }, token)
}

function exitMark(this: ThisParameterType<FromMarkdownHandle>, ...[token]: Parameters<FromMarkdownHandle>): ReturnType<FromMarkdownHandle> {
    this.exit(token)
}

function handleMark(...[node, , state, info]: Parameters<ToMarkdownHandle>): ReturnType<ToMarkdownHandle> {
    const tracker = state.createTracker(info)
    const exit = state.enter('mark' as ConstructName)
    let value = tracker.move('==')
    value += state.containerPhrasing(node, state, {
        ...tracker.current(),
        before: value,
        after: '=',
    })
    value += tracker.move('==')
    exit()
    return value
}

handleMark.peek = peekMark

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function peekMark(..._args: Parameters<ToMarkdownHandle>): ReturnType<ToMarkdownHandle> {
    return '='
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function remarkMark(this: Processor, ..._args: Parameters<Plugin<[] | void[], Root>>): void {
    const data = this.data()

    add('micromarkExtensions', mdMark())
    add('fromMarkdownExtensions', markFromMarkdown)
    add('toMarkdownExtensions', markToMarkdown)

    function add(field: string, value: unknown) {
        const list = (
            /* c8 ignore next 2 */
            data[field] ? data[field] : (data[field] = [])
        ) as unknown[]

        list.push(value)
    }
}
