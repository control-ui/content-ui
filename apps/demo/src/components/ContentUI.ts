import { CustomCodeMirror } from './CustomCodeMirror'
import { ContentLeafComponents } from '@content-ui/react/ContentLeaf'

export const contentUIMapping: { components: ContentLeafComponents } = {
    components: {
        CodeMirror: CustomCodeMirror,
    },
}
