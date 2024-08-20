import { Processor, unified } from 'unified'
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
import { Root } from 'mdast'
import { remarkInsert } from '@content-ui/md/plugins/remarkInsert'
import { remarkMark } from '@content-ui/md/plugins/remarkMark'
import { remarkSubSuper } from '@content-ui/md/plugins/remarkSubSuper'
import { remarkUnderline } from '@content-ui/md/plugins/remarkUnderline'

export const parserFromMarkDown = (parser: Processor) => parser
    .use(remarkParse)
    .use(remarkPresetLintConsistent)
    .use(remarkPresetLintRecommended)
    .use(remarkPresetLintNoDuplicateHeadings)
    .use(remarkLintListItemIndent, 'one')
    .use(remarkLintFinalNewline, false)

// export const parserInMarkDown = (parser: Processor<undefined, Root, Root, undefined, undefined>) => parser
export const parserInMarkDown = (parser: Processor<Root, Root, Root, undefined, undefined>) => parser
    .use(remarkFrontmatter)
    .use(remarkGfm, {
        singleTilde: false,
    })
    .use(remarkInsert)
    .use(remarkUnderline)
    .use(remarkMark)
    .use(remarkSubSuper)
    .use(remarkDefinitionList)

export const parserStringifyMarkDown = (parser: Processor<Root, Root extends undefined ? undefined : Root, Root, undefined, undefined>) => parser
    .use(remarkStringify, {
        bullet: '-',
        bulletOther: '*',
        bulletOrdered: '.',
        // todo: this option seems to be removed in unified v11
        // bulletOrderedOther: ')',
        emphasis: '*',
        strong: '*',
        fence: '`',
    })

export type ContentParserType = Processor<Root, Root, Root, Root, string>

export const ContentParser: ContentParserType =
    parserStringifyMarkDown(
        parserInMarkDown(
            parserFromMarkDown(
                unified(),
            ),
        ),
    )
