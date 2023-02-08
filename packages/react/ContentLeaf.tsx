import React from 'react'
import { Deco, DecoDataPluck, DecoDataResult } from '@tactic-ui/react/Deco'
import {
    TreeEngine,
    ReactLeafsRenderMatcher,
    createLeafsContext, ReactLeafsNodeSpec,
} from '@tactic-ui/react/LeafsProvider'
import { defineLeafNode } from '@tactic-ui/react/LeafNode'
import { EditorSelection } from '@content-ui/react/useContent'
import { CodeMirrorComponentProps } from '@ui-schema/kit-codemirror/CodeMirror'
import { CustomMdAstContent } from '@content-ui/md/Ast'

export interface ContentLeafPayload {
    elem: string
    selection?: EditorSelection | undefined
    selected?: boolean
    // `true` when first Leaf inside the parent level
    isFirst?: boolean
    // `true` when last Leaf inside the parent level
    isLast?: boolean
}

export type ContentLeafPropsSpec = { [K in CustomMdAstContent['type']]: { elem: K, child: CustomMdAstContent } }

export const dec = new Deco<ContentLeafPayload & ContentLeafPropsSpec[keyof ContentLeafPropsSpec]>()
/*.use(<P extends ContentDecoTW>(p: P): ContentDecoTW & { required: boolean } => ({...p, required: true}))
.use(<P extends ContentDecoTW & { required?: boolean }>(p: P): ContentDecoTW & { valid: boolean } => ({...p, valid: false}))*/

export type ContentLeafPayloadProps = DecoDataPluck<ContentLeafPropsSpec[keyof ContentLeafPropsSpec], typeof dec>
export type ContentLeafPayloadResult<S extends keyof ContentLeafPropsSpec = keyof ContentLeafPropsSpec> = DecoDataResult<ContentLeafPropsSpec[S], typeof dec>
export type ContentLeafsNodeSpec = ReactLeafsNodeSpec<ContentLeafPropsSpec, typeof dec>

export type ContentLeafComponents = {
    CodeMirror: React.ComponentType<CodeMirrorComponentProps & { lang?: string }>
}
export type ContentLeafProps<S extends keyof ContentLeafPropsSpec = keyof ContentLeafPropsSpec> = DecoDataResult<ContentLeafPropsSpec[S], typeof dec>

export const contentLeafEngine: TreeEngine<ContentLeafPropsSpec, typeof dec, ReactLeafsRenderMatcher<typeof dec, ContentLeafPropsSpec, ContentLeafComponents>> = {
    decorator: dec,
    matcher: (leafs, ld) => {
        // const valid = 'valid' in ld ? ld.valid : undefined
        if(!leafs[ld.elem]) {
            throw new Error('No LeafNode found for ' + ld.elem)
        }
        return leafs[ld.elem]
    },
    identifier: (ld) => ({
        // @ts-ignore
        toString: () => ld.storeKeys?.join('/') || '',
        // @ts-ignore
        toArray: () => ld.storeKeys?.toArray() || [],
    }),
}

export const contentLeafsContext = createLeafsContext<ContentLeafPropsSpec, ContentLeafComponents, typeof dec>(
    // @ts-ignore
    contentLeafEngine, {},
)

const {Leaf, useLeafs} = defineLeafNode(contentLeafsContext)
export const ContentLeaf = Leaf
export const useContentLeafs = useLeafs
