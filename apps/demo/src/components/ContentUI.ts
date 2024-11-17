import { renderMapping } from '@content-ui/md-mui/LeafsMarkdown'
import { MuiLink } from '@content-ui/md-mui/MuiComponents/MuiLink'
import { CustomCodeMirror } from './CustomCodeMirror.js'

export const contentUIMapping: typeof renderMapping = {
    ...renderMapping,
    leafs: {
        ...renderMapping.leafs,
    },
    components: {
        ...renderMapping.components,
        Code: CustomCodeMirror,
        Link: MuiLink,
    },
    matchLeaf: (p, l) => l[p.elem],
}
