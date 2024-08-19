import {
    LeafStrong, LeafText, LeafBr,
    LeafEmphasis, LeafUnderline,
    LeafThematicBreak,
    LeafDelete, LeafInsert, LeafMark,
    LeafSuper, LeafSub,
    LeafHtml,
} from '@content-ui/md-mui/Leafs/HTMLLeafs'
import { LeafH, LeafLink, LeafP } from '@content-ui/md-mui/Leafs/LeafTypo'
import { LeafList, LeafListItem } from '@content-ui/md-mui/Leafs/LeafList'
import { LeafCode, LeafCodeInline } from '@content-ui/md-mui/Leafs/LeafCode'
import { LeafBlockquote } from '@content-ui/md-mui/Leafs/LeafBlockquote'
import { LeafFootnote, LeafFootnoteDefinition, LeafFootnoteReference } from '@content-ui/md-mui/Leafs/LeafFootnote'
import { LeafTable, LeafTableCell, LeafTableRow } from '@content-ui/md-mui/Leafs/LeafTable'
import { LeafYaml } from '@content-ui/md-mui/Leafs/LeafYaml'
import { LeafTocListItem } from '@content-ui/md-mui/Leafs/LeafToc'
import { LeafImage } from '@content-ui/md-mui/Leafs/LeafImage'
import { ContentLeafComponents, ContentLeafsNodeMapping, LeafsRenderMapping } from '@content-ui/react/ContentLeaf'
import { LeafDefList, LeafDefListDescription, LeafDefListTerm } from '@content-ui/md-mui/Leafs/LeafDefList'

const leafs: ContentLeafsNodeMapping = {
    break: LeafBr,
    thematicBreak: LeafThematicBreak,
    text: LeafText,
    emphasis: LeafEmphasis,
    strong: LeafStrong,
    underline: LeafUnderline,
    delete: LeafDelete,
    insert: LeafInsert,
    mark: LeafMark,
    sub: LeafSub,
    super: LeafSuper,
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
    defList: LeafDefList,
    defListTerm: LeafDefListTerm,
    defListDescription: LeafDefListDescription,
    // @ts-ignore
    definition: null,
    // @ts-ignore
    imageReference: null,
    // @ts-ignore
    linkReference: null,
}

export const renderMapping: LeafsRenderMapping<ContentLeafsNodeMapping, ContentLeafComponents, { type: string }> = {
    leafs: leafs,
    components: {},
    matchLeaf: (p, l) => l[p.type],
}

