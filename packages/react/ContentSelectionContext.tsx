import React, { createContext, useContext } from 'react'

export interface EditorSelectionPosition {
    start: number
    startLine: number
    startLineStart: number
    startLineEnd: number

    end: number
    endLine: number
    endLineStart: number
    endLineEnd: number
}

export interface EditorSelectionFilled extends EditorSelectionPosition {
    selected: true
}

export interface EditorSelectionEmpty extends Partial<EditorSelectionPosition> {
    selected?: false
}

export type ContentSelection = EditorSelectionEmpty | EditorSelectionFilled
/**
 * @deprecated use `ContentSelection` instead
 */
export type EditorSelection = ContentSelection

export const ContentSelectionContext = createContext<ContentSelection | undefined>(undefined)

export const useContentSelection = () => useContext(ContentSelectionContext)

export const ContentSelectionProvider: React.FC<React.PropsWithChildren<{
    selection: ContentSelection | undefined
}>> = ({children, selection}) => {
    return <ContentSelectionContext.Provider value={selection}>
        {children}
    </ContentSelectionContext.Provider>
}
