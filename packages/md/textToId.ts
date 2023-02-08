export const textToId =
    (text: string, replace: RegExp = /[[\],:!?&.\\/\s|]/g): string =>
        text
            .replace(replace, '-')
            .replace(/^\d*\.*/, '')
            .replace(/--/g, '-')
            .replace(/^--/, '')
            .toLowerCase()
