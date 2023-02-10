import { Processor } from 'unified'
import remarkParse from 'remark-parse'
import remarkPresetLintConsistent from 'remark-preset-lint-consistent'
import remarkPresetLintRecommended from 'remark-preset-lint-recommended'
import remarkPresetLintNoDuplicateHeadings from 'remark-lint-no-duplicate-headings'
import remarkLintListItemIndent from 'remark-lint-list-item-indent'
import remarkLintFinalNewline from 'remark-lint-final-newline'
import remarkFrontmatter from 'remark-frontmatter'
import { remarkDefinitionList } from 'remark-definition-list'
import remarkGfm from 'remark-gfm'
import remarkStringify from 'remark-stringify'
import { parser } from '@content-ui/md/parser/ParseTo'
import { Root } from 'mdast'
import { remarkInsert } from '@content-ui/md/plugins/remarkInsert'
import { remarkMark } from '@content-ui/md/plugins/remarkMark'
import { remarkSubSuper } from '@content-ui/md/plugins/remarkSubSuper'

export const parserFromMarkDown = (parser: Processor<any, any, any, string>) => parser
    .use(remarkParse)
    .use(remarkPresetLintConsistent)
    .use(remarkPresetLintRecommended)
    .use(remarkPresetLintNoDuplicateHeadings)
    .use(remarkLintListItemIndent, 'space')
    .use(remarkLintFinalNewline, false)

export const parserInMarkDown = (parser: Processor<any, any, any, string>) => parser
    .use(remarkFrontmatter)
    .use(remarkGfm, {
        singleTilde: false,
    })
    .use(remarkInsert)
    .use(remarkMark)
    .use(remarkSubSuper)
    .use(remarkDefinitionList)

export const parserStringifyMarkDown = (parser: Processor<any, any, any, string>) => parser
    .use(remarkStringify, {
        bullet: '-',
        bulletOther: '*',
        bulletOrdered: '.',
        bulletOrderedOther: ')',
        emphasis: '*',
        strong: '*',
        fence: '`',
    })

export type ContentParserType = Processor<any, any, Root, string>

export const ContentParser: ContentParserType =
    parserStringifyMarkDown(
        parserInMarkDown(
            parserFromMarkDown(
                parser(),
            ),
        ),
    )
