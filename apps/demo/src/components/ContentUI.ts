import { renderMapping } from '@content-ui/md-mui/LeafsMarkdown'
import { CustomCodeMirror } from './CustomCodeMirror.js'

export const contentUIMapping: typeof renderMapping = {
    ...renderMapping,
    leafs: {
        ...renderMapping.leafs,
    },
    components: {
        ...renderMapping.components,
        Code: CustomCodeMirror,
    },
    matchLeaf: (p, l) => l[p.elem],
}
