import { Node, RootContent, Heading, Literal, Parent, PhrasingContent, Root, List } from 'mdast'
import { DefListNode, DefListDescriptionNode, DefListTermNode } from 'mdast-util-definition-list'

export interface Underline extends Parent {
    type: 'underline'
    children: PhrasingContent[]
}

export interface Insert extends Parent {
    type: 'insert'
    children: PhrasingContent[]
}

export interface Sub extends Parent {
    type: 'sub'
    children: PhrasingContent[]
}

export interface Super extends Parent {
    type: 'super'
    children: PhrasingContent[]
}

export interface Mark extends Parent {
    type: 'mark'
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

/**
 * @todo is each TocListItem not also a TocList due to nesting?
 *       refactor together with the toc leafs
 */
export interface TocList extends Omit<List, 'type' | 'children'> {
    type: 'tocList'
    children: TocListItem[]
}

export interface TocListItem extends Parent {
    type: 'tocListItem'
    // todo: using `value` is incompatible with mdast itself,
    //       same for the `data` property,
    //       thus used a special property `headline`,
    //       no matter how, this means the Toc isn't interoperable
    //       with e.g. text/html transforms and the headline would vanish
    headline: TocHNode
}

export type CustomMdAstContent =
    RootContent
    | Underline | Insert
    | Sub | Super
    | Mark
    | TocList | TocListItem
    | DefListNode | DefListTermNode | DefListDescriptionNode

export type CustomMdAstNodes = CustomMdAstContent | Root

export type MdAstGeneric = Node | Parent | Literal
