import { ReactNode } from 'react'
import {
    ContentLeafMatchParams, ContentLeafsPropsMapping, ContentRenderComponents,
    LeafsRenderMapping, ReactLeafsNodeSpec,
    useContentLeafs,
} from '@content-ui/react/ContentLeafsContext'

export function ContentLeaf<
    TAstNodes extends { type: string },
    TLeafDataMapping extends ContentLeafsPropsMapping<TAstNodes>,
    TElem extends TAstNodes['type'],
    TLeafData extends TLeafDataMapping[TElem],
>(
    props: Omit<TLeafData, 'renderMap'>,
): ReactNode {
    const {renderMap, Renderer} = useContentLeafs<
        TAstNodes, TLeafDataMapping, ContentRenderComponents,
        LeafsRenderMapping<ReactLeafsNodeSpec<TLeafDataMapping>, ContentRenderComponents, ContentLeafMatchParams>
    >()

    if(!Renderer) {
        throw new Error('ContentLeaf requires a Renderer, maybe missed adding it at the `ContentLeafsProvider`?')
    }

    return <Renderer
        {...props}
        renderMap={renderMap}
    />
}
