export const isLeafSelected = (
    position: { start: { line: number }, end: { line: number } } | undefined,
    startLine: number | undefined,
    endLine: number | undefined,
): boolean =>
    typeof position?.start.line === 'number' &&
    typeof startLine === 'number' &&
    typeof endLine === 'number' && (
        (
            // inside of a bigger element
            position.start.line <= startLine &&
            position.end.line >= startLine
            /*position.start.line <= startLine &&
            position.end.line >= endLine*/
        ) || (
            // inside of a bigger element
            position.start.line <= endLine &&
            position.end.line >= endLine
        ) || (
            // selecting multiple elements
            position.start.line >= startLine &&
            position.end.line <= endLine
        )
    )
