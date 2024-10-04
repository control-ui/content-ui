import { ReactElement } from 'react'
import { DecoratorProps, DecoratorPropsNext, ReactBaseDecorator, ReactDeco } from '@content-ui/react/EngineDecorator'
import {
    ContentLeafMatchParams, ContentLeafsPropsMapping, ContentRenderComponents,
    LeafsEngine, LeafsRenderMapping, ReactLeafsNodeSpec,
    useContentLeafs,
} from '@content-ui/react/ContentLeafsContext'

export type ContentLeafInjected = 'decoIndex' | 'next' | keyof LeafsEngine<any, any>

export function ContentLeaf<
    TLeafDataMapping extends ContentLeafsPropsMapping,
    TLeafData extends TLeafDataMapping[keyof TLeafDataMapping] & {},
    TDeco extends ReactDeco<{}, {}> = ReactDeco<{}, {}>,
    // todo: TProps not only need to support removing injected, but also allowing overriding
    TProps extends DecoratorProps<TLeafData, TDeco> = DecoratorProps<TLeafData, TDeco>,
>(
    props: Omit<TProps, ContentLeafInjected>,
): ReactElement | null {
    const {renderMap, deco} = useContentLeafs<
        TLeafDataMapping, ContentRenderComponents, TDeco,
        LeafsRenderMapping<ReactLeafsNodeSpec<TLeafDataMapping>, ContentRenderComponents, ContentLeafMatchParams>
    >()
    if(!deco) {
        throw new Error('This LeafNode requires decorators, maybe missed `deco` at the `ContentLeafsProvider`?')
    }

    const Next = deco.next(0) as ReactBaseDecorator<DecoratorPropsNext & { [k in ContentLeafInjected]: any }>
    // todo: `Next` can not be typed in any way i've found, thus here no error will be shown, except for missing "injected props"
    return <Next
        {...props}
        next={deco.next}
        decoIndex={0}
        renderMap={renderMap}
        deco={deco}
    />
}
