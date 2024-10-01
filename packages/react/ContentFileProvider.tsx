import * as React from 'react'
import { Root } from 'mdast'
import { ContentFileContextType, ContentContext, ContentSelectionContext, EditorSelection } from '@content-ui/react/useContent'
import { VFile } from 'vfile'

export const ContentFileProvider: React.FC<React.PropsWithChildren<{
    root: Root | undefined
    file: VFile | undefined
    editorSelection?: EditorSelection
}>> = ({root, file, editorSelection, children}) => {
    const cmCtx = React.useMemo((): ContentFileContextType => ({
        root,
        file,
    }), [root, file])

    return <ContentContext.Provider value={cmCtx}>
        <ContentSelectionContext.Provider value={editorSelection}>
            {children}
        </ContentSelectionContext.Provider>
    </ContentContext.Provider>
}
