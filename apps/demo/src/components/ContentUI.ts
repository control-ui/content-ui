import { renderMapping } from '@content-ui/md-mui/LeafsMarkdown'
import { LeafsRenderMapping } from '@tactic-ui/react/LeafsEngine'
import { ContentLeafComponents, ContentLeafsNodeMapping } from '@content-ui/react/ContentLeaf'
import { CustomCodeMirror } from './CustomCodeMirror.js'

export const contentUIMapping: LeafsRenderMapping<ContentLeafsNodeMapping, ContentLeafComponents> = {
    ...renderMapping,
    leafs: {
        ...renderMapping.leafs,
    },
    components: {
        ...renderMapping.components,
        CodeMirror: CustomCodeMirror,
    },
}
