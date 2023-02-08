import { Parent } from 'mdast'

export const flattenText = (c: Parent, text = []) => {
    return [
        ...text,
        ...c.children
            .map(c2 =>
                'value' in c2 && typeof c2.value === 'string' ? c2.value :
                    'children' in c2 ?
                        flattenText(c2) : undefined,
            )
            .filter(c => typeof c !== 'undefined'),
    ]
}
