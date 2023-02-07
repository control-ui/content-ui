import { Processor } from 'unified'
import remarkParse from 'remark-parse'
import remarkPresetLintConsistent from 'remark-preset-lint-consistent'
import remarkPresetLintRecommended from 'remark-preset-lint-recommended'
import remarkPresetLintNoDuplicateHeadings from 'remark-lint-no-duplicate-headings'
import remarkLintListItemIndent from 'remark-lint-list-item-indent'
import remarkLintFinalNewline from 'remark-lint-final-newline'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkStringify from 'remark-stringify'
import { parser } from '@content-ui/md/parser/ParseTo'

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

export const ContentParser =
    parserStringifyMarkDown(
        parserInMarkDown(
            parserFromMarkDown(
                parser(),
            ),
        ),
    )
