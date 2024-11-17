import { LeafChildNodes } from '@content-ui/md-mui/LeafChildNodes'
import { ContentLeafProps } from '@content-ui/react/ContentLeafsContext'
import { FC, JSX } from 'react'

const isSafeUrl = (url: string): boolean => {
    try {
        const parsedUrl = new URL(url, 'http://localhost') // dummy base for relative URLs
        return !['javascript:', 'data:'].includes(parsedUrl.protocol)
    } catch {
        return false
    }
}

const convertAttributesToProps = (attributes: Record<string, any>): Record<string, any> => {
    const reactProps: Record<string, any> = {}

    for(const [key, value] of Object.entries(attributes)) {
        if(key === 'class') {
            reactProps.className = value
        } else if(key === 'for') {
            reactProps.htmlFor = value
        } else if(
            key === 'style'
            || key === 'dangerouslySetInnerHTML'
            || key === 'innerHTML'
            || key === 'action'
            || key === 'target'
            || key === 'formaction'
            || key === 'poster'
            || key === 'data'
            || key === 'contenteditable'
            || key === 'xlink:href'
            || key === 'xml:base'
            || key === 'xmlns'
            || key === 'xmlns:xlink'
            || ((key === 'src' || key === 'href') && !isSafeUrl(value))
            || value.trim().startsWith('javascript:')
        ) {
            // ignoring styles and other potentially security related attributes
        } else if(key.startsWith('on')) {
            // ignoring event handler
        } else {
            reactProps[key] = value
        }
    }
    // todo: add defaults? e.g. `rel` for `target="_blank"`

    return reactProps
}

const dangerousElementTags = new Set(['iframe', 'script', 'style', 'svg', 'use'])
const isDangerousElement = (name: string) => dangerousElementTags.has(name)

const voidElementTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'])
const isVoidElementTag =
    (name: string) => voidElementTags.has(name)

export const LeafContainerDirective: FC<ContentLeafProps<'containerDirective'>> = ({child}) => {
    const ComponentName = isVoidElementTag(child.name) ? 'div' : child.name as keyof JSX.IntrinsicElements

    if(isDangerousElement(ComponentName)) return null

    return <ComponentName {...child.attributes ? convertAttributesToProps(child.attributes) : {}}>
        <LeafChildNodes childNodes={child.children}/>
    </ComponentName>
}

export const LeafTextDirective: FC<ContentLeafProps<'textDirective'>> = ({child}) => {
    const ComponentName = child.name as keyof JSX.IntrinsicElements

    if(isDangerousElement(ComponentName)) return null

    if(isVoidElementTag(ComponentName)) return <ComponentName {...child.attributes ? convertAttributesToProps(child.attributes) : {}}/>

    return <ComponentName {...child.attributes ? convertAttributesToProps(child.attributes) : {}}>
        <LeafChildNodes childNodes={child.children}/>
    </ComponentName>
}

export const LeafLeafDirective: FC<ContentLeafProps<'leafDirective'>> = ({child}) => {
    const ComponentName = child.name as keyof JSX.IntrinsicElements

    if(isDangerousElement(ComponentName)) return null

    if(isVoidElementTag(ComponentName)) return <ComponentName {...child.attributes ? convertAttributesToProps(child.attributes) : {}}/>

    return <ComponentName {...child.attributes ? convertAttributesToProps(child.attributes) : {}}>
        <LeafChildNodes childNodes={child.children}/>
    </ComponentName>
}
