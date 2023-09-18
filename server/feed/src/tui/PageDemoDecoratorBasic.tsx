import React from 'react'
import { ReactDeco, DecoratorProps, DecoratorPropsNext, DecoratorNextFn } from '@tactic-ui/react/Deco'
import { defineLeafEngine, GenericLeafsDataSpec, LeafsEngine, LeafsRenderMapping, ReactLeafsNodeSpec } from '@tactic-ui/react/LeafsEngine'
import { CustomLeafDataSpec, CustomLeafDataType, CustomLeafPropsSpec, CustomLeafPropsWithValue, DemoDecoratorProps, DemoDecorator1ResultProps } from './leafs.js'

export const Typo: React.FC<React.PropsWithChildren<{
    component?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    title?: string
}>> = (
    {
        component, title,
        children,
    },
) => {
    const Comp = component || 'p'
    return <Comp style={{margin: '0 0 0.125em 0'}} title={title}>
        {children}
    </Comp>
}


// 👉 1. to 4. are in `leafs.ts`
//
//
// 👉 5.1. Create a custom render engine out of the parts

type CustomLeafsNodeSpec = ReactLeafsNodeSpec<CustomLeafPropsSpec>
type CustomComponents = {}
type CustomLeafsRenderMapping<
    TLeafsMapping extends {} = {},
    TComponentsMapping extends {} = {}
> = LeafsRenderMapping<TLeafsMapping, TComponentsMapping>
type CustomLeafsEngine<
    TLeafsDataMapping extends GenericLeafsDataSpec,
    TComponents extends {},
    TRender extends LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping>, TComponents>,
    TDeco extends ReactDeco<{}, {}, {}>
> = LeafsEngine<TLeafsDataMapping, TComponents, TRender, TDeco> & {
    settings?: { hideTitles?: boolean }
}

const {
    LeafsProvider, useLeafs,
    // context,
} = defineLeafEngine<
    GenericLeafsDataSpec, CustomComponents,
    CustomLeafsRenderMapping<ReactLeafsNodeSpec<GenericLeafsDataSpec>, CustomComponents>,
    ReactDeco<{}, {}>,
    CustomLeafsEngine<GenericLeafsDataSpec, CustomComponents, CustomLeafsRenderMapping<ReactLeafsNodeSpec<GenericLeafsDataSpec>, CustomComponents>, ReactDeco<{}, {}>>
>()

// 👉 5.2. Create a custom LeafNode which maps the properties, decorators and handles the rendering

type LeafNodeInjected = 'decoIndex' | 'next' | keyof CustomLeafsEngine<any, any, any, any>

function LeafNode<
    TLeafsDataMapping extends GenericLeafsDataSpec,
    TDeco extends ReactDeco<{}, {}> = ReactDeco<{}, {}>,
    TLeafData extends TLeafsDataMapping[keyof TLeafsDataMapping] = TLeafsDataMapping[keyof TLeafsDataMapping],
    TComponentsMapping extends {} = {},
    TRender extends CustomLeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping>, TComponentsMapping> = CustomLeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping>, TComponentsMapping>,
    // todo: TProps not only needs to support removing injected, but also allowing overriding those injected
    TProps extends DecoratorProps<NonNullable<TLeafData>, TDeco> = DecoratorProps<NonNullable<TLeafData>, TDeco>,
>(
    props: Omit<TProps, LeafNodeInjected>, // remove the props injected by LeafNode
): React.JSX.Element | null {
    const {deco, render, settings} = useLeafs<TLeafsDataMapping, TComponentsMapping, TRender, TDeco>()
    if(!deco) {
        throw new Error('This LeafNode requires decorators, maybe missed `deco` at the `LeafsProvider`?')
    }

    // `Next` can not be typed in any way I've found (by inferring),
    // as the next decorator isn't yet known, only when wiring up the Deco,
    // thus here no error will be shown, except the safeguard that "all LeafNode injected are somehow passed down".
    const Next = deco.next(0)
    return <Next
        {...props}
        deco={deco}
        render={render}
        next={deco.next}
        settings={settings}
        decoIndex={0}
    />
}

// 👉 6. Simple React-Component based decorators to provide globally working logic, state injection etc.

// 🎵 note: the decorator typing must be exactly in the following style to work:
//          - generic P + decorator-requirements
//          - return `React.ReactElement<P & Res>` with the incoming `P` and if any, the props the decorator injects
//          - returning `| null` can be omitted, if the decorator doesn't do that
//          - using decorator-requirements only in the function parameter signature `fn(p: P & DemoDecoratorProps)` - and not at the fn-generics,
//            safeguards against leaking the requirements into the injected (result) props

// some very simple decorator, which makes an `id` prop from the `title` prop
function DemoDecorator<P extends DecoratorPropsNext>(p: P & DemoDecoratorProps): React.ReactElement<P & DemoDecorator1ResultProps> | null {
    const Next = p.next(p.decoIndex + 1)
    return <Next
        {...p}
        id={p.title.toLowerCase().replace(/[ .-]/g, '_')}
        decoIndex={p.decoIndex + 1}
    />
}

//
// 💎 the renderer - is also a decorator!
//

type DemoRendererProps = {
    // todo: try to make the render typing a bit stricter without circular CustomLeafProps import dependencies
    render: CustomLeafsRenderMapping<ReactLeafsNodeSpec<{ [k: string]: {} }>, {}>
    settings?: { hideTitles?: boolean }
    type: string
}

function DemoRenderer<P extends DecoratorPropsNext>(
    {
        render,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next,
        // todo: shouldn't `settings` be passed down here? maybe that is the solution to check for compat at the end,
        //       using the end result to check against the requirements of all leaf-props (in provider only)
        settings,
        ...p
    }: P & DemoDecoratorProps & { id: string } & DemoRendererProps,
): React.ReactElement<P> {
    // the last decorator must end the run - decorators afterwards are skipped silently
    const Leaf = render.leafs[p.type] as any
    return <div className={'mb2'}>
        {settings?.hideTitles ? null : <>
            <p className={'my0 body2'}>id: <code>{p.id}</code></p>
            <p className={'my0 body2'}>title: <code>{p.title}</code></p>
        </>}

        <Leaf {...p}/>
    </div>
}

function DebugDecorator<P extends { decoIndex: number, next: DecoratorNextFn<{ debug: true }> }>(p: P & { id: string }): React.ReactElement<P & { debug: true }> {
    const Next = p.next(p.decoIndex + 1)
    console.log('DebugDecorator', p.id, Next)
    return <Next
        {...p}
        decoIndex={p.decoIndex + 1}
        // this prop is required - of course it's possible to manually type the `next` stricter - just not by inferring, and it won't be validated in a higher level
        debug
    />
}


// 👉 7. Wire up the ReactDeco with all decorators and provide the global base props.
//       The decorators should only work on the "schema contracts" (and things required for those) but not on the specific leaf-props.

const deco = new ReactDeco<
    DecoratorPropsNext &
    DemoDecoratorProps &
    CustomLeafDataType<string> &
    {
        render: CustomLeafsRenderMapping<ReactLeafsNodeSpec<{ [k: string]: {} }>, CustomComponents>
        settings?: { hideTitles?: boolean }
    }
>()
    .use(DemoDecorator)
    // .use((p) => {
    //     console.log(p.title)
    //     console.log(p.id)
    //     return null
    // })
    .use(DebugDecorator)
    .use(DemoRenderer)

// 👉 8. Map the actual `Leaf` implementations

const BreakThematic: React.FC<CustomLeafPropsWithValue<CustomLeafDataType<'breakThematic'>>> =
    (props) => <hr title={props.storePath} style={{width: '100%'}}/>

const leafs: CustomLeafsNodeSpec = {
    headline: (props) => props.value.type === 'headline' ? <Typo component={'h3'} title={props.storePath}>{props.value.content || null}</Typo> : null,
    paragraph: (props) => props.value.type === 'paragraph' ? <Typo component={'p'} title={props.storePath}>{props.value.content || null}</Typo> : null,
    breakThematic: BreakThematic,
}

const render: CustomLeafsRenderMapping<CustomLeafsNodeSpec, CustomComponents> = {
    leafs: leafs,
    components: {},
}

//
// 👉 Example 2: using the LeafNode (NOT props) to render a data-list
//

const leafData: CustomLeafDataSpec[keyof CustomLeafDataSpec][] = [
    {
        type: 'headline',
        content: 'Lorem Ipsum',
    },
    {
        type: 'paragraph',
        content: 'Mauris ultrices anomima in cursus turpis massa tincidunt dui.',
    },
    {
        type: 'breakThematic',
    },
    {
        type: 'paragraph',
        content: 'Ac felis donec et odio pellentesque diam.',
    },
]
export const DemoAutomatic: React.FC = () => {
    // todo: the engine doesn't validate that decorators and render are compatible,
    //       and as the `deco` mustn't know about the Leafs in regard to circles,
    //       i think it is impossible to further guarantee deco+leafs are compatible
    //       - except maybe with a check using further generics on `LeafsProvider`
    return <div className={'flex flex-column'}>
        <LeafsProvider<CustomLeafPropsSpec>
            deco={deco}
            render={render}
        >
            {leafData.map((ld, i) =>
                <LeafNode<CustomLeafPropsSpec, typeof deco, CustomLeafPropsSpec[typeof ld.type]>
                    key={i}
                    // re-mapping data to props
                    {...{
                        // title is just some dummy for the decorators
                        title: 'Type ' + ld.type + ' No ' + i,
                        type: ld.type,
                        storePath: '/' + i,
                        value: ld,
                        // the "remove props injected by decorators" is also needed here
                    } as DecoratorProps<NonNullable<CustomLeafPropsSpec[typeof ld.type]>, typeof deco>}
                />)}
        </LeafsProvider>
    </div>
}
