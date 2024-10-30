import type { Parent } from 'mdast'

export const flattenText = (
    c: Parent,
    {
        select, joiner,
    }: {
        select?: () => boolean
        joiner?: (c2: Parent) => string
    } = {},
) => {
    return [
        ...c.children ?
            (select ? c.children.filter(select) : c.children)
                .map(c2 =>
                    'value' in c2 && typeof c2.value === 'string' ? c2.value :
                        'children' in c2 ?
                            // todo: use linebreak in eg list || and-or in parent of this fn?
                            flattenText(c2).join(joiner ? joiner(c2) : '') : undefined,
                )
                .filter(c => typeof c !== 'undefined') :
            [],
    ]
}
