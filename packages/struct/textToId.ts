export const textToId =
    (text: string): string =>
        text
            .toLowerCase()
            // replace any non-word characters (except `:` `.` `-`) with a hyphen
            .replace(/[^\w:.-]+/g, '-')
            // remove maybe generated leading hyphens, including numbers
            .replace(/^[-\d]+/, '')
            // replace multiple hyphens with a single one
            .replace(/-+/g, '-')
            // trim any trailing hyphens
            .replace(/-$/, '')
