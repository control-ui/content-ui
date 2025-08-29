import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import type { Root } from 'mdast'
import { VFile } from 'vfile'

export interface ContentFileContextType {
    root?: Root
    file?: VFile
}

export const ContentContext = createContext<ContentFileContextType>({})

export const useContentContext = () => useContext(ContentContext)

export const ContentFileProvider = (
    {
        root, file, children,
    }: PropsWithChildren<{
        root: Root | undefined
        file: VFile | undefined
    }>,
) => {
    const cmCtx = useMemo((): ContentFileContextType => ({
        root,
        file,
    }), [root, file])

    return <ContentContext.Provider value={cmCtx}>
        {children}
    </ContentContext.Provider>
}
