import { blockquoteToMarkdown } from '@content-ui/md/plugins/remarkGithubAlert'
import { Processor, unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkPresetLintConsistent from 'remark-preset-lint-consistent'
import remarkPresetLintRecommended from 'remark-preset-lint-recommended'
import remarkPresetLintNoDuplicateHeadings from 'remark-lint-no-duplicate-headings'
import remarkLintListItemIndent from 'remark-lint-list-item-indent'
import remarkLintFinalNewline from 'remark-lint-final-newline'
import remarkFrontmatter from 'remark-frontmatter'
import remarkEmoji from 'remark-gemoji'
import { remarkAlert } from 'remark-github-blockquote-alert'
import remarkGfm from 'remark-gfm'
import remarkStringify from 'remark-stringify'
import type { Root } from 'mdast'
import { remarkInsert } from '@content-ui/md/plugins/remarkInsert'
import { remarkMark } from '@content-ui/md/plugins/remarkMark'
import { remarkSubSuper } from '@content-ui/md/plugins/remarkSubSuper'
import { remarkUnderline } from '@content-ui/md/plugins/remarkUnderline'
// import { remarkFrontmatterAnywhere } from '@content-ui/md/plugins/remarkFrontmatterAnywhere'

export const parserFromMarkdown = (parser: Processor) => parser
    .use(remarkParse)

export const parserInMarkdown = (parser: Processor<Root, undefined, undefined, undefined, undefined>) => parser
    .use(remarkGfm, {
        singleTilde: false,
    })
    // .use(remarkFrontmatterAnywhere)
    // todo: allow setting this to a custom value?
    // todo: the default remarkFrontmatter does not make sense, as it "correctly" includes data-blocks with new-lines around,
    //       the custom "yaml frontmatter" for CodeMirror highlighting is stricter and does not allow new-lines around the fences,
    //       which makes it a bit more portable, as `\n---\n` is often used for thematic breaks
    // .use(remarkFrontmatter, {
    //     type: 'yaml',// 'frontmatter',
    //     marker: '-',
    //     anywhere: true,
    // })
    // using this afterward to overwrite the "anywhere: true" plugin, if that uses another type than this
    .use(remarkFrontmatter, {
        // todo: allow setting this to `frontmatter`? makes any default remark incompatible
        type: 'yaml',
        marker: '-',
        anywhere: false,
    })
    .use(remarkAlert)
    .use(remarkEmoji)
    .use(remarkInsert)
    .use(remarkUnderline)
    .use(remarkMark)
    .use(remarkSubSuper)

export const parserLintInMarkdown = (parser: Processor<Root, Root extends undefined ? undefined : Root, Root, undefined, undefined>) => parser
    .use(remarkPresetLintConsistent)
    .use(remarkPresetLintRecommended)
    .use(remarkPresetLintNoDuplicateHeadings)
    .use(remarkLintListItemIndent, 'one')
    .use(remarkLintFinalNewline, false)

export const parserStringifyMarkdown = (parser: Processor<Root, Root extends undefined ? undefined : Root, Root, undefined, undefined>) => parser
    .use(remarkStringify, {
        bullet: '-',
        bulletOther: '*',
        bulletOrdered: '.',
        // todo: this option seems to be removed in unified v11
        // bulletOrderedOther: ')',
        emphasis: '*',
        strong: '*',
        fence: '`',
        handlers: {
            blockquote: blockquoteToMarkdown,
        },
    })

export type ContentParserType = Processor<Root, Root, Root, Root, string>

export const ContentParser: ContentParserType =
    parserStringifyMarkdown(
        parserLintInMarkdown(
            parserInMarkdown(
                parserFromMarkdown(
                    unified(),
                ),
            ),
        ),
    )
