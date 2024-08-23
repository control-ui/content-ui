import { MuiContentRenderComponents, renderMapping } from '@content-ui/md-mui/LeafsMarkdown'
import { ContentLeafsNodeMapping, LeafsRenderMapping, ContentLeafMatchParams } from '@content-ui/react/ContentLeaf'
import { CustomCodeMirror } from './CustomCodeMirror.js'

export const contentUIMapping: LeafsRenderMapping<ContentLeafsNodeMapping, MuiContentRenderComponents, ContentLeafMatchParams> = {
    ...renderMapping,
    leafs: {
        ...renderMapping.leafs,
    },
    components: {
        ...renderMapping.components,
        Code: CustomCodeMirror,
    },
    matchLeaf: (p, l) => l[p.type],
}
