import { visit, SKIP } from 'unist-util-visit'
import { Plugin } from 'unified'
import { Root, Paragraph, Text } from 'mdast'
import { Parent, Node } from 'unist'

interface DetailsNode extends Parent {
    type: 'details'
    data?: {
        hName?: string
        hProperties?: Record<string, any>
    }
    children: Array<SummaryNode | any>
}

interface SummaryNode extends Parent {
    type: 'summary'
    data?: {
        hName?: string
    }
    children: Array<Paragraph | Text>
}

/**
 * A remark plugin which parses `<details><summary>` into AST nodes.
 *
 * It does not fully parse HTML, and manually collects the needed nodes.
 *
 * @experimental written as a scribble, works in root and list items, should be performance optimized, nothing more checked.
 * @author Michael Becker
 */
export const remarkDetails: Plugin<[], Root> = () => {
    return (tree) => {
        const processedNodes = new Set<Node>()

        visit(tree, 'html', (node, index, parent) => {
            if(!parent || index === undefined || processedNodes.has(node)) {
                return
            }

            const openMatch = node.value.trim().match(/^<details(\s+open)?>\s*<summary>(.*?)<\/summary>/is)

            if(!openMatch) {
                return
            }

            let depth = 1
            let endIndex = -1

            // Iterate through the siblings *after* the opening tag.
            for(let i = index + 1; i < parent.children.length; i++) {
                const sibling = parent.children[i]

                if(sibling.type === 'html') {
                    // @ts-ignore
                    const htmlValue = sibling.value.trim()
                    if(/^<details/i.test(htmlValue)) {
                        depth++
                    } else if(/^<\/details>/i.test(htmlValue)) {
                        depth--
                    }
                }

                // If depth is 0, we've found our closing tag.
                if(depth === 0) {
                    endIndex = i
                    break
                }
            }

            if(endIndex !== -1) {
                const innerContent = parent.children.slice(index + 1, endIndex)
                const nodesToReplace = parent.children.slice(index, endIndex + 1)

                nodesToReplace.forEach(n => processedNodes.add(n))

                // Recursively transform the inner content to handle any nested details blocks.
                const transformedChildren = transform(innerContent)

                const isOpen = !!openMatch[1]
                const summaryText = openMatch[2]
                const summaryNode: SummaryNode = {
                    type: 'summary',
                    data: {hName: 'summary'},
                    children: [{type: 'text', value: summaryText}],
                }
                if(node.position) {
                    summaryNode.position = node.position
                }

                const detailsNode: DetailsNode = {
                    type: 'details',
                    data: {
                        hName: 'details',
                        ...(isOpen ? {hProperties: {open: true}} : {}),
                    },
                    children: [summaryNode, ...transformedChildren],
                }
                const endNode = parent.children[endIndex]
                if(node.position && endNode.position) {
                    detailsNode.position = {start: node.position.start, end: endNode.position.end}
                }

                // Replace the original HTML nodes (from <details> to </details>) with our new, structured detailsNode.
                // @ts-ignore
                parent.children.splice(index, nodesToReplace.length, detailsNode)

                // Tell `visit` to skip over the children of the node we just added.
                // The next node to process will be at the same index, since we replaced the content.
                return [SKIP, index]
            }
        })
    }
}

function transform(nodes: any[]): any[] {
    const newChildren: any[] = []
    const stack: DetailsNode[] = []
    let currentChildren = newChildren

    for(const node of nodes) {
        if(node.type === 'html' && typeof node.value === 'string') {
            const trimmed = node.value.trim()

            const openMatch = trimmed.match(/^<details(\s+open)?>\s*<summary>(.*?)<\/summary>/is)
            if(openMatch) {
                const openAttr = !!openMatch[1]
                const summaryText = openMatch[2]

                const summaryNode: SummaryNode = {
                    type: 'summary',
                    data: {hName: 'summary'},
                    children: [{type: 'text', value: summaryText}],
                }

                if(node.position) {
                    summaryNode.position = node.position
                }

                const detailsNode: DetailsNode = {
                    type: 'details',
                    data: {
                        hName: 'details',
                        ...(openAttr ? {hProperties: {open: true}} : {}),
                    },
                    children: [summaryNode],
                }

                if(node.position) {
                    detailsNode.position = {
                        start: node.position.start,
                        // end position is a placeholder
                        end: node.position.end,
                    }
                }

                currentChildren.push(detailsNode)
                stack.push(detailsNode)
                currentChildren = detailsNode.children
                continue
            }

            if(/^<\/details>/i.test(trimmed)) {
                const finishedDetailsNode = stack.pop()

                if(finishedDetailsNode && node.position && finishedDetailsNode.position) {
                    finishedDetailsNode.position.end = node.position.end
                }

                if(stack.length > 0) {
                    currentChildren = stack[stack.length - 1].children
                } else {
                    currentChildren = newChildren
                }
                continue
            }
        }

        currentChildren.push(node)
    }

    return newChildren
}
