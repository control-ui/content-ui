export const textToObj = (text: string) => text
    .split('\n')
    .reduce(
        (lines, line, i) => ({
            ...lines,
            ['L' + i]: line,
        }),
        {} as { [k: string]: string },
    )

export const textToList = (text: string) => text
    .split('\n')
    .reduce(
        (lines, line) => ([
            ...lines,
            line,
        ]),
        [] as string[],
    )
