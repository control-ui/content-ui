import React from 'react'
import { Root } from 'mdast'
import { VFile } from 'vfile'

export interface ContentFileContextType {
    root?: Root
    file?: VFile
}

export const ContentContext = React.createContext<ContentFileContextType>({})

export const useContentContext = () => React.useContext(ContentContext)

export const ContentFileProvider: React.FC<React.PropsWithChildren<{
    root: Root | undefined
    file: VFile | undefined
}>> = ({root, file, children}) => {
    const cmCtx = React.useMemo((): ContentFileContextType => ({
        root,
        file,
    }), [root, file])

    return <ContentContext.Provider value={cmCtx}>
        {children}
    </ContentContext.Provider>
}
