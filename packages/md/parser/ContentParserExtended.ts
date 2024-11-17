import { parserFromMarkdown, parserInMarkdown, parserLintInMarkdown, parserStringifyMarkdown } from '@content-ui/md/parser/ContentParser'
import { Processor, unified } from 'unified'
import remarkDirective from 'remark-directive'
import { remarkDefinitionList } from 'remark-definition-list'
import type { Root } from 'mdast'

export const parserInMarkdownExtended = (parser: Processor<Root, Root, Root, undefined, undefined>) => parser
    .use(remarkDirective)
    .use(remarkDefinitionList)

export type ContentParserType = Processor<Root, Root, Root, Root, string>

export const ContentParserExtended: ContentParserType =
    parserStringifyMarkdown(
        parserLintInMarkdown(
            parserInMarkdownExtended(
                parserInMarkdown(
                    parserFromMarkdown(
                        unified(),
                    ),
                ),
            ),
        ),
    )
