//
// The typing for decorators and leafs used in this tactic-ui demo implementation.
//

// 👉 1.1. Define the basic decorator props,
//    split them by "required by decorator" and "result of decorator",
//
//    What is a decorator? https://refactoring.guru/design-patterns/decorator
//    Here applied in a way where react-components serve as decorators to the props passed through,
//    but as react allows more, the decorator additional functions like a middleware in pipeline systems.
//
//    Remember, data flows down in React, this is why it's a more one-way pipeline,
//    where communication from deeper decorators to higher decorators in the pipeline,
//    must be done through additional hoisted states, like a React context https://react.dev/learn/passing-data-deeply-with-context
//    To improve performance/reliance, do not interconnect decorators with states in themselves, but only through states outside the pipeline.

export interface DemoDecoratorProps {
    title: string
}

export interface DemoDecorator1ResultProps extends DemoDecoratorProps {
    id: string
}


// 👉 1.2. Define two types which will be used as base for props of all leafs
//    - one base typing: used for every other typing
//    - one base-props typing: based upon the first base and used for every `Leaf` to build the `props` automatically
//    - this must contain the meta data, like the properties which are used for "matching"
//    - for LeafEngines which provide data-bindings it should also contain e.g. `storeKeys` / `storePath` / `entityName`+`entityId`
//
//    What is a Leaf? https://en.wikipedia.org/wiki/Leaf
//    Like a tree has many leafs and branches, the leaf is the visible thing at the end of a branch.
//    Here the Leaf can start new branches or be the visible end, with rendering steered by the decorators
//    - which could introduce other branches - but are intended to provide reusable logic (around state injection),
//    across a multitude of Leaf implementations.

export interface CustomLeafDataType<T extends string> {
    type: T
}

export type CustomLeafPropsWithValue<V extends CustomLeafDataType<string>> =
    {
        type: V['type']
        storePath: string
        value: V
    } &
    {
        dense?: boolean
    } &
    // include all props that should be available for the widgets
    DemoDecoratorProps &
    DemoDecorator1ResultProps

// 👉 2. Define further types which are specific to only some mappings
export interface CustomLeafDataOfContent {
    content: string
}

// 👉 3. Define a mapping of which "leaf type" should use which `LeafData` as specific values object
export interface CustomLeafDataSpec {
    headline: CustomLeafDataType<'headline'> & CustomLeafDataOfContent
    paragraph: CustomLeafDataType<'paragraph'> & CustomLeafDataOfContent
    breakThematic: CustomLeafDataType<'breakThematic'>
    // breakThematic: CustomLeafDataType<'breakThematic'> & { content: string | number }

    // decide for typing if:
    // - strict with "only specific leafs and their properties"
    // - OR "universal leaf-props" typing which allows any Leaf with one typing
    // mixing both - will result in a lot of pain, as the generic will partly influence the specific leaf props,
    //
    // mixing partly works if the generic is broader than all existing leaf-props AND all leaf-props have the same or narrower typing
    // [k: string]: CustomLeafDataType<string> & { content: string | number }

    // (generic is narrower than leaf-props) won't work with the `content: string | number`
    // [k: string]: CustomLeafDataType<string> & { content: string }
}

// 👉 4. Define a `props` typing map for React Components, this remaps the data mappings (which are now also props mappings)

export type CustomLeafPropsSpec = {
    // for support of providing only some leafs,
    // check where in the `PageDemoDecoratorBasic` the `NonNullable<>` is used and use the `?`,
    // otherwise remove the `?` here:
    [NT in keyof CustomLeafDataSpec]?: CustomLeafPropsWithValue<CustomLeafDataSpec[NT]>
}

// 🎵 note: this allows using e.g. `NonNullable<CustomLeafPropsSpec[keyof CustomLeafPropsSpec]>[]` to make something like the following for data-lists:
//      `(CustomLeafPropsSpec['headline'] | CustomLeafPropsSpec['paragraph'] | CustomLeafPropsSpec['breakThematic'])[]`
