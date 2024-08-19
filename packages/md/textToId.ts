export const textToId =
    (text: string): string =>
        text
            .toLowerCase()
            .replace(/[^\w:.-]+/g, '-')
            .replace(/^\d*\.*/, '') // remove `1.`/`2.` at the headline start
            .replace(/^-+/, '-') // remove maybe generated leading hyphens
