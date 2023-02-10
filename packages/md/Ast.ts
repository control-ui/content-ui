import { Content, Heading, Literal, Parent, PhrasingContent, Root } from 'mdast'
import { Literal as UnistLiteral, Node } from 'unist'
import { DefListNode, DefListDescriptionNode, DefListTermNode } from 'mdast-util-definition-list'

export interface Underline extends Parent {
    type: 'underline'
    children: PhrasingContent[]
}

export interface Insert extends Parent {
    type: 'insert'
    children: PhrasingContent[]
}

export interface TocHNode {
    headline: Heading
    headlineIndex: number
    rootIndex: number
    flatText: string[]
    id: string
    nested?: TocHNode[]
}

export interface TocListItem extends Parent, UnistLiteral {
    type: 'tocListItem'
    value: TocHNode
}

export type CustomMdAstContent = Content | Underline | Insert | TocListItem | DefListNode | DefListTermNode | DefListDescriptionNode
export type CustomMdAstNodes = CustomMdAstContent | Root

export type MdAstGeneric = Node | Parent | Literal

export interface WithMdAstChild<C extends MdAstGeneric = CustomMdAstContent> {
    child: C
}
