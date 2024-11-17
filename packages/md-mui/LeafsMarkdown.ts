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
import { LeafFootnoteDefinition, LeafFootnoteReference } from '@content-ui/md-mui/Leafs/LeafFootnote'
import { LeafTable, LeafTableCell, LeafTableRow } from '@content-ui/md-mui/Leafs/LeafTable'
import { LeafYaml } from '@content-ui/md-mui/Leafs/LeafYaml'
import { LeafTocListItem } from '@content-ui/md-mui/Leafs/LeafToc'
import { LeafImage } from '@content-ui/md-mui/Leafs/LeafImage'
import { MuiContentRenderComponents } from '@content-ui/md-mui/LeafsComponents'
import { ContentLeafsNodeMapping, LeafsRenderMapping, ContentLeafMatchParams, ContentLeafsPropsMapping } from '@content-ui/react/ContentLeafsContext'
import { LeafDefList, LeafDefListDescription, LeafDefListTerm } from '@content-ui/md-mui/Leafs/LeafDefList'
import { CustomMdAstContent } from '@content-ui/struct/Ast'

const leafs: ContentLeafsNodeMapping<ContentLeafsPropsMapping<CustomMdAstContent>> = {
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
    footnoteDefinition: LeafFootnoteDefinition,
    footnoteReference: LeafFootnoteReference,
    table: LeafTable,
    tableRow: LeafTableRow,
    tableCell: LeafTableCell,
    tocListItem: LeafTocListItem,
    defList: LeafDefList,
    defListTerm: LeafDefListTerm,
    defListDescription: LeafDefListDescription,
    definition: null,
    imageReference: null,
    linkReference: null,
}

export const renderMapping: LeafsRenderMapping<
    ContentLeafsNodeMapping<ContentLeafsPropsMapping<CustomMdAstContent>>,
    MuiContentRenderComponents,
    ContentLeafMatchParams
> = {
    leafs: leafs,
    components: {},
    matchLeaf: (p, l) => l[p.elem],
}
