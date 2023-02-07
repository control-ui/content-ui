import { Processor } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import { parser } from '@content-ui/md/parser/ParseTo'
import { parserInMarkDown, parserStringifyMarkDown } from '@content-ui/md/parser/ContentParser'

export const parserFromHtmlToMarkDown = (parser: Processor<any, any, any, string>) => parser
    .use(rehypeParse)
    .use(rehypeRemark)

export const HTMLParser =
    parserStringifyMarkDown(
        parserInMarkDown(
            parserFromHtmlToMarkDown(
                parser(),
            ),
        ),
    )
