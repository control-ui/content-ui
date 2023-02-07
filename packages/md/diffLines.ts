export const diffLines = (
    linesA: { [k: string]: string },
    linesB: { [k: string]: string },
) => {
    const linesAValues = Object.values(linesA)
    const linesBValues = Object.values(linesB)
    const linesACount = linesAValues.length
    const linesBCount = linesBValues.length
    const diffs: any[] = []
    const diffLine = (lineA: string | undefined, lineB: string | undefined, i: number) => {
        if(typeof lineB === 'undefined') {
            return {
                line: i,
                type: 'deleted',
            }
        } else if(typeof lineA === 'undefined') {
            return {
                line: i,
                type: 'added',
                text: lineB,
            }
        } else if(lineA !== lineB) {
            return {
                line: i,
                type: 'changed',
                text: lineB,
            }
        }
        return undefined
    }
    if(linesACount >= linesBCount) {
        linesAValues.forEach((lineA, i) => {
            const lineB = linesBValues[i]
            const diff = diffLine(lineA, lineB, i)
            if(diff) {
                diffs.push(diff)
            }
        })
    } else if(linesACount < linesBCount) {
        linesBValues.forEach((lineB, i) => {
            const lineA = linesAValues[i]
            const diff = diffLine(lineA, lineB, i)
            if(diff) {
                diffs.push(diff)
            }
        })
    }
    return diffs
}
