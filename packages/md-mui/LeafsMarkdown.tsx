import { LeafBr, LeafDelete, LeafEmphasis, LeafHtml, LeafInsert, LeafStrong, LeafText, LeafThematicBreak, LeafUnderline } from '@content-ui/md-mui/Leafs/HTMLLeafs'
import { LeafH, LeafLink, LeafP } from '@content-ui/md-mui/Leafs/LeafTypo'
import { LeafList, LeafListItem } from '@content-ui/md-mui/Leafs/LeafList'
import { LeafCode, LeafCodeInline } from '@content-ui/md-mui/Leafs/LeafCode'
import { LeafBlockquote } from '@content-ui/md-mui/Leafs/LeafBlockquote'
import { LeafFootnote, LeafFootnoteDefinition, LeafFootnoteReference } from '@content-ui/md-mui/Leafs/LeafFootnote'
import { LeafTable, LeafTableCell, LeafTableRow } from '@content-ui/md-mui/Leafs/LeafTable'
import { LeafYaml } from '@content-ui/md-mui/Leafs/LeafYaml'
import { LeafTocListItem } from '@content-ui/md-mui/Leafs/LeafToc'
import { LeafImage } from '@content-ui/md-mui/Leafs/LeafImage'
import { LeafsRenderMapping, defineLeafsProvider } from '@tactic-ui/react/LeafsProvider'
import { contentLeafEngine, contentLeafsContext, ContentLeafComponents, ContentLeafsNodeSpec } from '@content-ui/react/ContentLeaf'

const leafs: ContentLeafsNodeSpec = {
    break: LeafBr,
    thematicBreak: LeafThematicBreak,
    text: LeafText,
    emphasis: LeafEmphasis,
    strong: LeafStrong,
    underline: LeafUnderline,
    delete: LeafDelete,
    insert: LeafInsert,
    heading: LeafH,
    paragraph: LeafP,
    html: LeafHtml,
    image: LeafImage,
    link: LeafLink,
    code: LeafCode,
    yaml: LeafYaml,
    inlineCode: LeafCodeInline,
    list: LeafList,
    listItem: LeafListItem,
    blockquote: LeafBlockquote,
    footnote: LeafFootnote,
    footnoteDefinition: LeafFootnoteDefinition,
    footnoteReference: LeafFootnoteReference,
    table: LeafTable,
    tableRow: LeafTableRow,
    tableCell: LeafTableCell,
    tocListItem: LeafTocListItem,
    // @ts-ignore
    definition: null,
    // @ts-ignore
    imageReference: null,
    // @ts-ignore
    linkReference: null,
}

export const customRenderMapping: LeafsRenderMapping<ContentLeafsNodeSpec, ContentLeafComponents> = {
    leafs: leafs,
    // @ts-ignore
    components: {},
}

export const LeafsMarkdownProvider = defineLeafsProvider(contentLeafsContext, contentLeafEngine, customRenderMapping)
