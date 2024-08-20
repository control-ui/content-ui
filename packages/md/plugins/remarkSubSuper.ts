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

function mdSubSup(): Extension {
    const tokenizer = {
        tokenize: tokenizeSubSup,
        resolveAll: resolveAllSubSup,
    }

    return {
        text: {
            [codes.tilde]: tokenizer,
            [codes.caret]: tokenizer,
        },
        insideSpan: {null: [tokenizer]},
        attentionMarkers: {null: [codes.tilde, codes.caret]},
    }

    function resolveAllSubSup(...[events, context]: Parameters<Resolver>): ReturnType<Resolver> {
        let index = -1

        // Walk through all events.
        while(++index < events.length) {
            // Find a token that can close.
            if(
                events[index][0] === 'enter' &&
                (events[index][1].type === 'subSequenceTemporary' || events[index][1].type === 'superSequenceTemporary') &&
                events[index][1]._close
            ) {
                let open = index
                const enterType = events[index][1].type
                const type = enterType === 'subSequenceTemporary' ? 'sub' : 'super'

                // Now walk back to find an opener.
                while(open--) {
                    // Find a token that can open the closer.
                    if(
                        events[open][0] === 'exit' &&
                        events[open][1].type === enterType &&
                        events[open][1]._open &&
                        // If the sizes are the same:
                        events[index][1].end.offset - events[index][1].start.offset ===
                        events[open][1].end.offset - events[open][1].start.offset
                    ) {
                        events[index][1].type = type + 'Sequence'
                        events[open][1].type = type + 'Sequence'

                        const subSuper = {
                            type: type,
                            start: Object.assign({}, events[open][1].start),
                            end: Object.assign({}, events[index][1].end),
                        }

                        const text = {
                            type: type + 'Text',
                            start: Object.assign({}, events[open][1].end),
                            end: Object.assign({}, events[index][1].start),
                        }

                        // Opening.
                        const nextEvents = [
                            ['enter', subSuper, context],
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
                            ['exit', subSuper, context],
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
            if(events[index][1].type === 'subSequenceTemporary' || events[index][1].type === 'superSequenceTemporary') {
                events[index][1].type = types.data
            }
        }

        return events
    }

    function tokenizeSubSup(this: ThisParameterType<Tokenizer>, ...[effects, ok, nok]: Parameters<Tokenizer>): ReturnType<Tokenizer> {
        const previous = this.previous
        const events = this.events
        let size = 0
        let lastOpened: string | undefined = undefined

        return start

        function start(...[code]: Parameters<State>): ReturnType<State> {
            // assert(code === codes.tilde || code === codes.caret, 'expected `~|^`')

            if(
                previous === code &&
                events[events.length - 1][1].type !== types.characterEscape
            ) {
                return nok(code)
            }

            const type = code === codes.tilde ? 'sub' : 'super'
            lastOpened = type + 'SequenceTemporary'
            effects.enter(lastOpened)

            return more(code)
        }

        function more(code) {
            const before = classifyCharacter(previous)

            if(code === codes.tilde || code === codes.caret) {
                if(size > 1) return nok(code)
                effects.consume(code)
                size++
                return more
            }

            if(size > 1) return nok(code)
            if(lastOpened) {
                const token = effects.exit(lastOpened)
                const after = classifyCharacter(code)
                token._open =
                    !after || (after === constants.attentionSideAfter && Boolean(before))
                token._close =
                    !before || (before === constants.attentionSideAfter && Boolean(after))
            }
            return ok(code)
        }
    }
}

const subSupFromMarkdown: FromMarkdownExtension = {
    canContainEols: [],
    enter: {
        sub: enterSub,
        super: enterSup,
    },
    exit: {
        sub: exitSubSup,
        super: exitSubSup,
    },
}


function enterSub(this: ThisParameterType<FromMarkdownHandle>, ...[token]: Parameters<FromMarkdownHandle>): ReturnType<FromMarkdownHandle> {
    this.enter({
        // @ts-ignore
        type: 'sub',
        data: {hName: 'sub'},
        children: [],
    }, token)
}

function exitSubSup(this: ThisParameterType<FromMarkdownHandle>, ...[token]: Parameters<FromMarkdownHandle>): ReturnType<FromMarkdownHandle> {
    this.exit(token)
}

function enterSup(this: ThisParameterType<FromMarkdownHandle>, ...[token]: Parameters<FromMarkdownHandle>): ReturnType<FromMarkdownHandle> {
    this.enter({
        // @ts-ignore
        type: 'super',
        data: {hName: 'sup'},
        children: [],
    }, token)
}

export const subToMarkdown: ToMarkdownExtension & { handlers: Partial<Handlers & Record<'sub', Handle>> | null | undefined } = {
    unsafe: [{character: '~', inConstruct: 'phrasing'}],
    handlers: {sub: handleSub},
}

function handleSub(...[node, , state, info]: Parameters<ToMarkdownHandle>): ReturnType<ToMarkdownHandle> {
    const tracker = state.createTracker(info)
    const exit = state.enter('sub' as ConstructName)
    let value = tracker.move('~')
    value += state.containerPhrasing(node, state, {
        ...tracker.current(),
        before: value,
        after: '~',
    })
    value += tracker.move('~')
    exit()
    return value
}

export const superToMarkdown: ToMarkdownExtension & { handlers: Partial<Handlers & Record<'super', Handle>> | null | undefined } = {
    unsafe: [{character: '^', inConstruct: 'phrasing'}],
    handlers: {super: handleSuper},
}

function handleSuper(...[node, , context, safeOptions]: Parameters<ToMarkdownHandle>): ReturnType<ToMarkdownHandle> {
    const tracker = track(safeOptions)
    const exit = context.enter('sub' as ConstructName)
    let value = tracker.move('^')
    value += containerPhrasing(node, context, {
        ...tracker.current(),
        before: value,
        after: '^',
    })
    value += tracker.move('^')
    exit()
    return value
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function remarkSubSuper(this: Processor, ..._args: Parameters<Plugin<[] | void[], Root>>): void {
    const data = this.data()

    add('micromarkExtensions', mdSubSup())
    add('fromMarkdownExtensions', subSupFromMarkdown)
    // todo: check the `toMarkdown` plugins, seems to work but unclear what peek does
    add('toMarkdownExtensions', subToMarkdown)
    add('toMarkdownExtensions', superToMarkdown)

    function add(field: string, value: unknown) {
        const list = (
            /* c8 ignore next 2 */
            data[field] ? data[field] : (data[field] = [])
        ) as unknown[]

        list.push(value)
    }
}
